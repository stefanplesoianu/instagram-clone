package com.yapbook.security;

import io.jsonwebtoken.Claims;
import jakarta.annotation.PostConstruct;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.SecureRandom;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private static String staticJwtSecret;

    @PostConstruct
    public void init() {
        staticJwtSecret = this.jwtSecret;
    }

    private final long EXPIRATION_TIME_MS = 1000 * 60 * 60 * 24 * 7; 

    public String generateToken(String username, Integer userId, String guestId) {
        if (userId == null && guestId == null) {
            throw new IllegalArgumentException("Either userId or guestId must be provided");
        }
 
        var builder = Jwts.builder()
                          .setIssuedAt(new Date())
                          .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME_MS))
                          .signWith(SignatureAlgorithm.HS256, staticJwtSecret);

        if(userId != null) {
                builder.claim("id", userId)
                       .claim("username", username)
                       .claim("jti", generateJti());
        }

        if(guestId != null) {
                builder.claim("guestId", guestId);
        }

        return builder.compact();
    }

    private String generateJti() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[16];
        random.nextBytes(bytes);
        return bytesToHex(bytes);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public static Boolean validateToken(String token) {
        try {
            Boolean isExpired = isTokenExpired(token);
            
            Integer userId = getUserIdFromToken(token);
            String guestId = getGuestIdFromToken(token);
            
            return !isExpired && (userId != null || guestId != null);
        } catch (Exception e) {
            return false;
        }
    }
    

    private static Boolean isTokenExpired(String token) {
        return getExpirationDateFromToken(token).before(new Date());
    }

    public static Integer getUserIdFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("id", Integer.class));
    }

    public static String getGuestIdFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("guestId", String.class));
    }

    public static String getJtiFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("jti", String.class));
    }

    public static Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public static <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        try {
            Claims claims = Jwts.parser()
                                .setSigningKey(staticJwtSecret)
                                .parseClaimsJws(token)
                                .getBody();
            return claimsResolver.apply(claims);
        } catch (Exception e) {
            throw new RuntimeException("Error extracting claim from token", e);
        }
    }
    
}

