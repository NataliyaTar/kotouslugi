package ru.practice.kotouslugi.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import ru.practice.kotouslugi.model.enums.StatementStatus;

@Component
public class MVDClient {

  private final RestTemplate restTemplate;
  private final String mvdServiceUrl;

  @Autowired
  public MVDClient(
    RestTemplate restTemplate,
    @Value("${mvd.service.url}") String mvdServiceUrl
  ) {
    this.restTemplate = restTemplate;
    this.mvdServiceUrl = mvdServiceUrl;
  }

  public StatementStatus verifyPassport(String message) {
    return restTemplate.postForObject(
      mvdServiceUrl + "/verify-passport",
      message,
      StatementStatus.class
    );
  }
}
