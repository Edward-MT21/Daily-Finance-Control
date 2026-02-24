package com.project.dafico.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;

@Configuration
@EnableJpaAuditing // Esta anotación activa el @CreatedDate y @CreatedBy
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        // Por ahora, como es sencillo, devolvemos siempre "admin"
        // Más adelante podrías sacar el usuario del SecurityContext
        return () -> Optional.of("amalia");
    }
}
