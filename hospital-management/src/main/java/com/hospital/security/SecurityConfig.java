package com.hospital.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Autowired 
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // ===== PUBLIC AUTH ENDPOINTS =====
                .requestMatchers("/admin/auth/**").permitAll()
                .requestMatchers("/user/auth/**").permitAll()
                .requestMatchers("/auth/**").permitAll()
                
                // ===== PREFLIGHT REQUESTS =====
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // ===== DOCTORS ENDPOINT =====
                .requestMatchers(HttpMethod.GET, "/doctors").permitAll()
                .requestMatchers(HttpMethod.GET, "/doctors/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/doctors").authenticated()
                .requestMatchers(HttpMethod.PUT, "/doctors/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/doctors/**").authenticated()
                
                // ===== APPOINTMENTS ENDPOINT - ALL PUBLIC =====
                .requestMatchers(HttpMethod.GET, "/appointments").permitAll()
                .requestMatchers(HttpMethod.GET, "/appointments/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/appointments").permitAll()
                .requestMatchers(HttpMethod.PUT, "/appointments").permitAll()
                .requestMatchers(HttpMethod.PUT, "/appointments/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/appointments/**").permitAll()
                
                // ===== EVERYTHING ELSE REQUIRES AUTH =====
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001"
        ));
        
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"
        ));

        // ✅ FIX: explicit headers required when allowCredentials=true
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        configuration.setAllowCredentials(true);
        
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept"
        ));
        
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
