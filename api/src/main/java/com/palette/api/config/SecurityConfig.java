package com.palette.api.config;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
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
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
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

    @Value("${spring.security.oauth2.resourceserver.jwt.entra.issuer-uri:}")
    private String entraIssuerUri;

    @Value("${spring.security.oauth2.resourceserver.jwt.entra.audience:}")
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
                        .bearerTokenResolver(cookieAndHeaderTokenResolver())
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
     * Checks Authorization header first (for Entra Bearer tokens),
     * then falls back to the jwt-token cookie (for local users).
     */
    @Bean
    public BearerTokenResolver cookieAndHeaderTokenResolver() {
        DefaultBearerTokenResolver headerResolver = new DefaultBearerTokenResolver();

        return request -> {
            // Try Authorization header first (Entra admin tokens)
            String headerToken = headerResolver.resolve(request);
            if (headerToken != null) {
                return headerToken;
            }

            // Fall back to cookie (local user tokens)
            if (request.getCookies() != null) {
                for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                    if ("jwt-token".equals(cookie.getName())) {
                        return cookie.getValue();
                    }
                }
            }

            return null;
        };
    }

    /**
     * Routes each incoming JWT to the right decoder based on the request path.
     * /v1/admin/** uses the Entra decoder, all other endpoints use the local HS256 decoder.
     */
    @Bean
    public JwtDecoder multiTenantJwtDecoder() {
        JwtDecoder localDecoder = localJwtDecoder();
        JwtDecoder entraDecoder = entraJwtDecoder();

        return token -> {
            jakarta.servlet.http.HttpServletRequest request =
                    ((org.springframework.web.context.request.ServletRequestAttributes)
                            org.springframework.web.context.request.RequestContextHolder
                                    .getRequestAttributes())
                            .getRequest();

            if (request.getRequestURI().startsWith("/v1/admin/")) {
                return entraDecoder.decode(token);
            } else {
                return localDecoder.decode(token);
            }
        };
    }

    // HS256 decoder for local users
    private JwtDecoder localJwtDecoder() {
        byte[] bytes = Base64.getDecoder().decode(this.secretKey);
        return NimbusJwtDecoder.withSecretKey(new SecretKeySpec(bytes, "HmacSHA256")).build();
    }

    // RS256 decoder for Entra ID tokens
    private JwtDecoder entraJwtDecoder() {
        NimbusJwtDecoder decoder = JwtDecoders.fromIssuerLocation(entraIssuerUri);

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
     * Maps token origin to Spring Security authorities.
     * Entra tokens get ENTRA + SCOPE_* authorities.
     * Local tokens get LOCAL authority.
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            List<GrantedAuthority> authorities = new ArrayList<>();
            String issuer = jwt.getIssuer() != null ? jwt.getIssuer().toString() : "";

            if (issuer.contains("microsoftonline.com") || issuer.contains("sts.windows.net")) {
                authorities.add(new SimpleGrantedAuthority("ENTRA"));
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
                .keyID(UUID.randomUUID().toString())
                .build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }
}