//package com.palette.api.service;
//
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//import io.jsonwebtoken.Claims;
//
//import javax.crypto.SecretKey;
//import java.security.Key;
//import java.util.Date;
//import java.util.Map;
//import java.util.function.Function;
//
//@Service
//public class JwtService {
//    @Value("${security.jwt.secret-key}")
//    private String secretKey;
//
//    @Value("${security.jwt.expiration-time}")
//    private long jwtExpiration;
//
//    public String extractUsername(String token){
//        return extractClaim(token, Claims::getSubject);
//    }
//
//    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }
//
//    private Claims extractAllClaims(String token){
//        return Jwts
//                .parser()
//                .verifyWith(getSignInKey())
//                .build()
//                .parseSignedClaims(token)
//                .getPayload();
//    }
//
//    private SecretKey getSignInKey(){
//        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
//    }
//
//    private String buildToken(
//            Map<String, Object> extraClaims,
//            UserDetails userDetails,
//            long expiration
//    ){
//        return Jwts
//                .builder()
//                .claims()
//                .subject(userDetails.getUsername())
//                .issuedAt(new Date(System.currentTimeMillis()))
//                .expiration(new Date(System.currentTimeMillis() + expiration))
//                .add(extraClaims)
//                .and()
//                .signWith(getSignInKey())
//                .compact();
//    }
//
//
//
//
//}
