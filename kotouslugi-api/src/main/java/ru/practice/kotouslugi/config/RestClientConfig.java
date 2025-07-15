package ru.practice.kotouslugi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestClientConfig {

  @Value("${rest.connection.timeout}")
  private int connectionTimeout;

  @Value("${rest.read.timeout}")
  private int readTimeout;

  @Bean
  public RestTemplate restTemplate() {
    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
    factory.setConnectTimeout(connectionTimeout);
    factory.setReadTimeout(readTimeout);
    return new RestTemplate(factory);
  }
}
