package ru.practice.kotouslugi.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import ru.practice.kotouslugi.model.enums.StatementStatus;

@Component
public class BankClient {

  private final RestTemplate restTemplate;
  private final String bankServiceUrl;

  @Autowired
  public BankClient(
    RestTemplate restTemplate,
    @Value("${bank.service.url}") String bankServiceUrl
  ) {
    this.restTemplate = restTemplate;
    this.bankServiceUrl = bankServiceUrl;
  }

  public StatementStatus processPaymentDuty(String message) {
    return restTemplate.postForObject(
      bankServiceUrl + "/payment_duty",
      message,
      StatementStatus.class
    );
  }
}
