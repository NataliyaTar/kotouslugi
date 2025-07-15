package ru.practice.kotouslugi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class ApiApplication {

  public static void main(String[] args) {
    SpringApplication.run(ru.practice.kotouslugi.ApiApplication.class, args);
  }

}
