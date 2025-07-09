package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.practice.kotouslugi.dao.FeedbackRepository;
import ru.practice.kotouslugi.dao.MainEntityRepository;
import ru.practice.kotouslugi.dao.MetricsRepository;
import ru.practice.kotouslugi.dao.StatementForPassportRepository;
import ru.practice.kotouslugi.model.Feedback;
import ru.practice.kotouslugi.model.MainEntity;
import ru.practice.kotouslugi.model.Metrics;
import ru.practice.kotouslugi.model.StatementForPassport;
import ru.practice.kotouslugi.model.enums.MvdProcessingStatus;
import ru.practice.kotouslugi.model.enums.StatementStatus;

import java.time.LocalDateTime;

@Service
public class PasswordService {
  /// Репозитории
  private final StatementForPassportRepository statementForPassportRepository;
  private final FeedbackRepository feedbackRepository;
  private final MetricsRepository metricsRepository;
  private final MainEntityRepository mainEntityRepository;

  private final RestTemplate restTemplate;


  /// Настройка сервиса
  public PasswordService(StatementForPassportRepository statementForPassportRepository,
                         FeedbackRepository feedbackRepository,
                         MetricsRepository metricsRepository,
                         MainEntityRepository mainEntityRepository,
                         RestTemplate restTemplate) {
    this.statementForPassportRepository = statementForPassportRepository;
    this.feedbackRepository = feedbackRepository;
    this.metricsRepository = metricsRepository;
    this.mainEntityRepository = mainEntityRepository;
    this.restTemplate = restTemplate;
  }


  /// Основные функции сервиса
  public MainEntity addStatementForPassport(StatementForPassport statementForPassport) {
    // Сохраняем данные из формы в БД.
    statementForPassportRepository.save(statementForPassport);

    // Создаём главную сущность и сразу добавляем в неё данные из формы(StatementForPassport).
    MainEntity mainEntity = MainEntity.builder().build();
    mainEntity.setStatement(statementForPassport);
    mainEntityRepository.save(mainEntity);

    // Добавляем метрики к main сущности и сохранение метрики в БД
    Metrics metrics = Metrics.builder().build();
    metrics.setDateStart(LocalDateTime.now());
    metricsRepository.save(metrics);
    mainEntity.setMetrics(metrics);
    mainEntityRepository.save(mainEntity);

    // Ставим статус "обрабатывается" и добавляем заявление в БД
    metrics.setStatus(StatementStatus.IN_PROCESSING);
    metricsRepository.save(metrics);

    // Отправляем в МВД
    StatementForPassport mvd_answer = sent_to_mvd(statementForPassport);
    if (mvd_answer != null) {
      // Поставили статус SENT и сохранили в БД
      statementForPassport.setMvdProcessingStatus(MvdProcessingStatus.SENT);
      statementForPassportRepository.save(statementForPassport);
      // Сохранили в БД полученный от МВД статус в само заявление
      statementForPassport.setMvdProcessingStatus(mvd_answer.getMvdProcessingStatus());
      statementForPassportRepository.save(statementForPassport);
    }

    // Если в МВД отклонили, то устанавливаем финальный статус в заявлении "отклонено в МВД". Больше заявка не обрабатывается
    if (statementForPassport.getMvdProcessingStatus() == MvdProcessingStatus.REJECTED) {
      metrics.setStatus(StatementStatus.REJECTED_IN_MVD);
      metrics.setDateEnd(LocalDateTime.now());
      metricsRepository.save(metrics);
    }

    return mainEntity;
  }


  public StatementForPassport payment_duty(StatementForPassport statementForPassport) {
    StatementForPassport bank_answer = sent_to_bank(statementForPassport);
    statementForPassport.setPoshlina(bank_answer.getPoshlina());
    statementForPassportRepository.save(statementForPassport);

    return statementForPassport;
  }





  public Feedback addFeedback(Feedback feedback) {
    feedbackRepository.save(feedback);
    return feedback;
  }


  /// Ручки к другим сервисам
  public StatementForPassport sent_to_mvd(StatementForPassport statement) {
    String url = "http://localhost:8080/api/mvd/verify-passport";
    return restTemplate.postForObject(url, statement, StatementForPassport.class);
  }


  public StatementForPassport sent_to_bank(StatementForPassport statement) {
    String url = "http://localhost:8080/api/bank/payment_duty";
    return restTemplate.postForObject(url, statement, StatementForPassport.class);
  }
}
