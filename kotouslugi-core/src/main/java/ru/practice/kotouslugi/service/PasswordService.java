package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.practice.kotouslugi.dao.FeedbackRepository;
import ru.practice.kotouslugi.dao.MetricsRepository;
import ru.practice.kotouslugi.dao.StatementForPassportRepository;
import ru.practice.kotouslugi.model.Feedback;
import ru.practice.kotouslugi.model.Metrics;
import ru.practice.kotouslugi.model.StatementForPassport;
import ru.practice.kotouslugi.model.enums.MvdProcessingStatus;
import ru.practice.kotouslugi.model.enums.StatementStatus;

@Service
public class PasswordService {
  /// Репозитории
  private final StatementForPassportRepository statementForPassportRepository;
  private final FeedbackRepository feedbackRepository;
  private final MetricsRepository metricsRepository;

  private final RestTemplate restTemplate;

  public PasswordService(StatementForPassportRepository statementForPassportRepository,
                         FeedbackRepository feedbackRepository,
                         MetricsRepository metricsRepository,
                         RestTemplate restTemplate) {
    this.statementForPassportRepository = statementForPassportRepository;
    this.feedbackRepository = feedbackRepository;
    this.metricsRepository = metricsRepository;
    this.restTemplate = restTemplate;
  }

  public StatementForPassport addStatementForPassport(StatementForPassport statementForPassport) {
    /// Добавляем метрики к созданному заявлению и сохранение метрики в БД
    Metrics metrics = Metrics.builder().build();
    metricsRepository.save(metrics);


    /// Ставим статус "обрабатывается" и добавляем заявление в БД
    statementForPassport.setStatus(StatementStatus.IN_PROCESSING);
    statementForPassportRepository.save(statementForPassport);

    /// Отправляем в МВД
    StatementForPassport mvd_answer = sent_to_mvd(statementForPassport);
    if (mvd_answer != null) {
      /// Поставили статус SENT и сохранили в БД
      statementForPassport.setMvdProcessingStatus(MvdProcessingStatus.SENT);
      statementForPassportRepository.save(statementForPassport);
      /// Сохранили в БД полученный от МВД статус в само заявление
      statementForPassport.setMvdProcessingStatus(mvd_answer.getMvdProcessingStatus());
      statementForPassportRepository.save(statementForPassport);
    }

    /// Если в МВД отклонили, то устанавливаем финальный статус в заявлении "отклонено в МВД"
    if (statementForPassport.getMvdProcessingStatus() == MvdProcessingStatus.REJECTED) {
      statementForPassport.setStatus(StatementStatus.REJECTED_IN_MVD);
      statementForPassportRepository.save(statementForPassport);
    }

    return statementForPassport;
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
