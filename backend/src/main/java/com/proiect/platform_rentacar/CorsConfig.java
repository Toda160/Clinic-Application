package com.proiect.platform_rentacar;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Permite toate căile
                        .allowedOrigins("http://localhost:3000") // Permite doar frontend-ul React
                        .allowedMethods("*") // Permite toate metodele HTTP (GET, POST, PUT, DELETE, OPTIONS, etc.)
                        .allowedHeaders("*") // Permite toate headerele
                        .exposedHeaders("Authorization") // Expune header-ul Authorization dacă este utilizat
                        .allowCredentials(true); // Permite utilizarea credențialelor (cookies, headers, etc.)
            }
        };
    }
}
