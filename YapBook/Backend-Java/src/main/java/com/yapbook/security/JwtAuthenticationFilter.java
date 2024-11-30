package com.yapbook.security;

import com.yapbook.users.UserRepository;
import jakarta.servlet.FilterChain;
import org.springframework.stereotype.Component;
import jakarta.servlet.ServletException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import java.util.ArrayList;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;
    private final BlacklistTokenRepository blacklistTokenRepository;

    @Autowired
    public JwtAuthenticationFilter(JwtTokenUtil jwtTokenUtil, UserRepository userRepository, BlacklistTokenRepository blacklistTokenRepository) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
        this.blacklistTokenRepository = blacklistTokenRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        if("/users/guest".equals(requestURI) || "/users/login".equals(requestURI) ||
             "/errors".equals(requestURI) || "/users/register".equals(requestURI)) {
            filterChain.doFilter(request,response);
            return;
        }
        
        String token = getTokenFromRequest(request);
        System.out.println("Extracted Token: " + token);

        if (token != null && jwtTokenUtil.validateToken(token)) {
            String jti = jwtTokenUtil.getJtiFromToken(token);

            if (blacklistTokenRepository.findByToken(token).isPresent()) {
                System.out.println("Token is blacklisted: " + token);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is blacklisted");
                return;
            }

            Integer userId = jwtTokenUtil.getUserIdFromToken(token);
            String guestId = jwtTokenUtil.getGuestIdFromToken(token);

            if (userId != null) {
                request.setAttribute("userId", userId);
                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(userId, null, new ArrayList<>()));
            } else if (guestId != null) {
                request.setAttribute("guestId", guestId);
            }
        } else if (token == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is missing");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
