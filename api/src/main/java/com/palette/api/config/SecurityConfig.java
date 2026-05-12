package com.palette.api.config;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.*;


@Configuration
public class SecurityConfig {

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private int port;

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${spring.security.oauth2.resourceserver.jwt.entra.issuer-uri}")
    private String entraIssuerUri;

    @Value("${spring.security.oauth2.resourceserver.jwt.entra.audience}")
    private String entraAudience;

    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/v1/admin/**").hasAuthority("SCOPE_access_as_admin")
                        .requestMatchers("/v1/auth/login").permitAll()
                        .requestMatchers("/v1/auth/register").permitAll()
                        .requestMatchers("/v1/auth/verify").permitAll()
                        .requestMatchers("/v1/auth/profile").authenticated()
                        .anyRequest().permitAll()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(multiTenantJwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                )
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
                        .accessDeniedHandler(new BearerTokenAccessDeniedHandler()));

        return http.build();
    }

    /**
     * Routes each incoming JWT to the right decoder based on its "iss" (issuer) claim.
     * No decoding happens before routing — we just peek at the unverified claim to decide.
     */
    @Bean
    public JwtDecoder multiTenantJwtDecoder() {
        JwtDecoder localDecoder = localJwtDecoder();
        JwtDecoder entraDecoder = entraJwtDecoder();

        return token -> {
            // Peek at the issuer claim without verifying the signature yet
            String issuer = extractIssuerUnchecked(token);

            if (issuer != null && (issuer.contains("microsoftonline.com") || issuer.contains("sts.windows.net"))) {
                return entraDecoder.decode(token);
            } else {
                return localDecoder.decode(token);
            }
        };
    }

    // Your existing HS256 decoder
    private JwtDecoder localJwtDecoder() {
        byte[] bytes = Base64.getDecoder().decode(this.secretKey);
        return NimbusJwtDecoder.withSecretKey(new SecretKeySpec(bytes, "HmacSHA256")).build();
    }

    // Entra RS256 decoder — Spring auto-fetches the JWKS from the issuer URI
    private JwtDecoder entraJwtDecoder() {
        NimbusJwtDecoder decoder = JwtDecoders.fromIssuerLocation(entraIssuerUri);

        // Validate the audience claim so only tokens meant for your API are accepted
        OAuth2TokenValidator<Jwt> audienceValidator = jwt -> {
            if (jwt.getAudience().contains(entraAudience)) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(
                    new OAuth2Error("invalid_token", "Invalid audience", null));
        };

        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(entraIssuerUri);
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator));
        return decoder;
    }

    /**
     * Reads the "iss" claim from the JWT payload WITHOUT verifying the signature.
     * This is safe here because we only use it to choose which decoder to run —
     * the chosen decoder still fully verifies the signature.
     */
    private String extractIssuerUnchecked(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) return null;
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            // Simple string check — no need for a full JSON parser
            int issStart = payload.indexOf("\"iss\":\"") + 7;
            if (issStart < 7) return null;
            int issEnd = payload.indexOf("\"", issStart);
            return payload.substring(issStart, issEnd);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Adds a custom "SOURCE" authority so controllers can distinguish token origin.
     * Entra tokens get ENTRA authority; local tokens get LOCAL authority.
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            List<GrantedAuthority> authorities = new ArrayList<>();
            String issuer = jwt.getIssuer() != null ? jwt.getIssuer().toString() : "";

            if (issuer.contains("microsoftonline.com") || issuer.contains("sts.windows.net")) {
                authorities.add(new SimpleGrantedAuthority("ENTRA"));

                // Map scp claim to Spring authorities
                String scp = jwt.getClaimAsString("scp");
                if (scp != null) {
                    Arrays.stream(scp.split(" "))
                            .forEach(scope -> authorities.add(new SimpleGrantedAuthority("SCOPE_" + scope)));
                }
            } else {
                authorities.add(new SimpleGrantedAuthority("LOCAL"));
            }

            return authorities;
        });
        return converter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(host);
        mailSender.setPort(port);

        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");

        return mailSender;


    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        byte[] bytes = Base64.getDecoder().decode(this.secretKey);
        return NimbusJwtDecoder.withSecretKey(new SecretKeySpec(bytes, "HmacSHA256")).build();
    }

    @Bean
    JwtEncoder jwtEncoder() {
        byte[] bytes = Base64.getDecoder().decode(this.secretKey);
        OctetSequenceKey jwk = new OctetSequenceKey.Builder(bytes)
                .algorithm(JWSAlgorithm.HS256)
                .keyID(UUID.randomUUID().toString()) // <-- this is what was missing
                .build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);


    }
}