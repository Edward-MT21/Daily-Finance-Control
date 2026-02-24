package com.project.dafico.configurations;

import com.project.dafico.entities.User;
import com.project.dafico.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            // Verificamos si ya existe para no crearlo duplicado cada vez que reinicies
            if (userRepository.findByUsername("amalia").isEmpty()) {
                User admin = new User();
                admin.setUsername("amalia");
                admin.setPassword("amalia123"); // En el futuro, aquí usarás BCrypt
                userRepository.save(admin);
            }
        };
    }
}