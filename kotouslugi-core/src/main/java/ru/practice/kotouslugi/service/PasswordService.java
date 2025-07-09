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
import ru.practice.kotouslugi.model.enums.StatementStatus;

import java.time.LocalDateTime;
import java.util.Objects;

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

    // Ставим статус "заявление создано" и добавляем заявление в БД
    metrics.setStatus(StatementStatus.CREATED);
    metricsRepository.save(metrics);

    // Отправляем в МВД и устанавливаем статус "направленно в мвд".
    metrics.setStatus(StatementStatus.SENT_TO_MVD);
    metricsRepository.save(metrics);
    StatementStatus mvd_answer = sent_to_mvd("что-то отправляем в мвд");
    if (mvd_answer == null) {
      // Поставили статус "отправлено в МВД" и сохранили в БД. Это финальный статус.
      metrics.setStatus(StatementStatus.ERROR_IN_MVD);
      metrics.setDateEnd(LocalDateTime.now());
      metricsRepository.save(metrics);
    }

    // Если в МВД отклонили, то устанавливаем финальный статус в заявлении "отклонено в МВД". Больше заявка не обрабатывается
    if (Objects.equals(mvd_answer, StatementStatus.REJECTED_IN_MVD)) {
      metrics.setStatus(StatementStatus.REJECTED_IN_MVD);
      metrics.setDateEnd(LocalDateTime.now());
      metricsRepository.save(metrics);
    }

    // Если в МВД не отклонили, то устанавливаем финальный статус "готово в МВД".
    if (Objects.equals(mvd_answer, StatementStatus.READY_IN_MVD)) {
      metrics.setStatus(StatementStatus.READY_IN_MVD);
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
  public StatementStatus sent_to_mvd(String message) {
    String url = "http://localhost:8080/api/mvd/verify-passport";
    return restTemplate.postForObject(url, message, StatementStatus.class);
  }


  public StatementForPassport sent_to_bank(StatementForPassport statement) {
    String url = "http://localhost:8080/api/bank/payment_duty";
    return restTemplate.postForObject(url, statement, StatementForPassport.class);
  }
}
