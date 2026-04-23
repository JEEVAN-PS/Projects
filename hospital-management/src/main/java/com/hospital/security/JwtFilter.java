package com.hospital.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    // Public endpoints that don't require JWT validation
    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
        "/admin/auth/register",
        "/admin/auth/login",
        "/user/auth/register",
        "/user/auth/login",
        "/auth/send-otp",
        "/auth/verify-otp",
        "/auth/reset-password",
        "/doctors",
        "/appointments"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // ✅ Skip JWT validation for public endpoints
        if (isPublicEndpoint(path, method)) {
            System.out.println("📖 Public endpoint - skipping JWT validation: " + method + " " + path);
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ For protected endpoints, validate JWT
        String authHeader = request.getHeader("Authorization");
        
        System.out.println("🔐 Protected endpoint - checking JWT: " + method + " " + path);
        System.out.println("AUTH HEADER: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);
                
                System.out.println("EMAIL FROM TOKEN: " + email);
                System.out.println("ROLE FROM TOKEN: " + role);

                if (email != null && jwtUtil.validateToken(token, email)) {
                    // Create authorities with role
                    List<GrantedAuthority> authorities = new ArrayList<>();
                    if (role != null) {
                        String formattedRole = role.toUpperCase();

                        // Avoid double ROLE_
                        if (!formattedRole.startsWith("ROLE_")) {
                            formattedRole = "ROLE_" + formattedRole;
                        }

                        authorities.add(new SimpleGrantedAuthority(formattedRole));
                    }

                    System.out.println("✅ FINAL ROLE SET: " + authorities);

                    UsernamePasswordAuthenticationToken authToken = 
                            new UsernamePasswordAuthenticationToken(email, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                System.err.println("❌ JWT validation failed: " + e.getMessage());
            }
        } else {
            System.out.println("⚠️  No JWT token provided for protected endpoint");
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Check if the requested endpoint is public (doesn't require JWT)
     */
    private boolean isPublicEndpoint(String path, String method) {
        // Allow all OPTIONS requests (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }

        // Check if path matches any public endpoint
        for (String publicPath : PUBLIC_ENDPOINTS) {
            if (path.startsWith(publicPath)) {
                return true;
            }
        }

        return false;
    }
}