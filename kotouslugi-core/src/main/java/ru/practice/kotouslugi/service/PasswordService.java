package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.practice.kotouslugi.dao.FeedbackRepository;
import ru.practice.kotouslugi.dao.StatementForPassportRepository;
import ru.practice.kotouslugi.model.Feedback;
import ru.practice.kotouslugi.model.StatementForPassport;
import ru.practice.kotouslugi.model.enums.MvdProcessingStatus;

@Service
public class PasswordService {
  private final StatementForPassportRepository statementForPassportRepository;
  private final FeedbackRepository feedbackRepository;
  private final RestTemplate restTemplate;

  public PasswordService(StatementForPassportRepository statementForPassportRepository,
                         FeedbackRepository feedbackRepository,
                         RestTemplate restTemplate) {
    this.statementForPassportRepository = statementForPassportRepository;
    this.feedbackRepository = feedbackRepository;
    this.restTemplate = restTemplate;
  }

  public StatementForPassport addStatementForPassport(StatementForPassport statementForPassport) {
    statementForPassportRepository.save(statementForPassport);
    StatementForPassport mvd_answer = sent_to_mvd(statementForPassport);
    statementForPassportRepository.save(mvd_answer);
    return mvd_answer;
  }

  public StatementForPassport sent_to_mvd(StatementForPassport statement) {
    String url = "http://localhost:8080/api/mvd/verify-passport";
    return restTemplate.postForObject(url, statement, StatementForPassport.class);
  }

  public Feedback addFeedback(Feedback feedback) {
    feedbackRepository.save(feedback);
    return feedback;
  }
}
