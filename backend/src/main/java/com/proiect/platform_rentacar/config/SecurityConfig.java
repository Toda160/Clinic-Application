package com.proiect.platform_rentacar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .cors().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests(auth -> auth
                        // Endpoint-uri publice
                        .mvcMatchers("/api/auth/**").permitAll()
                        // Permisiuni specifice pentru doctor
                        .mvcMatchers("/api/doctor/**").hasRole("DOCTOR")
                        .mvcMatchers(HttpMethod.DELETE, "/api/doctor/{doctorId}/appointments/**").hasRole("DOCTOR")
                        // Permisiuni pentru pacient și doctor la programări
                        .mvcMatchers("/api/appointments/patient/**").hasRole("PATIENT") // Permisiune pentru pacient
                        .mvcMatchers("/api/appointments/doctor/**/busy-slots").hasAnyRole("DOCTOR", "PATIENT") // Permite accesul pentru ambele roluri
                        .mvcMatchers("/api/appointments/**").hasAnyRole("PATIENT", "DOCTOR")
                        .mvcMatchers("/api/doctor/all").hasRole("PATIENT")
                        // Permisiune pentru pacienți să adauge recenzii
                        .mvcMatchers(HttpMethod.POST, "/api/patient/{patientId}/review").hasRole("PATIENT")

                        // Orice altceva necesită autentificare
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }




    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
            throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
