package ru.practice.kotouslugi.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

  @Bean
  public OpenAPI openAPI() {
    return new OpenAPI()
      .info(new Info()
        .title("Kotouslugi API")
        .description("Методы работы с котоуслугами")
        .version("2.0")
        .contact(new Contact().name("Nataliya Tarantseva, Alena Sukhova."))
        .license(new License().name("Not licended")));
  }
}
