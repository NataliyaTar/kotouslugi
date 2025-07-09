package ru.practice.kotouslugi.service;

import jakarta.persistence.EntityNotFoundException;
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
import ru.practice.kotouslugi.request.FeedbackRequest;

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

    // Ставим статус "заявление создано" и обновляем метрики в БД
    metrics.setStatus(StatementStatus.CREATED);
    metricsRepository.save(metrics);

    // Устанавливаем статус "направленно в мвд" и отправляем в МВД.
    metrics.setStatus(StatementStatus.SENT_TO_MVD);
    metricsRepository.save(metrics);
    StatementStatus mvd_answer = sent_to_mvd("что-то отправляем в мвд");

    // Если ответа от МВД не пришло выставляем соответствующий статус.
    if (mvd_answer == null) {
      // Поставили статус "ошибка в МВД" и сохранили в БД. Это финальный статус.
      metrics.setStatus(StatementStatus.ERROR_IN_MVD);
      metrics.setDateEnd(LocalDateTime.now());
      metricsRepository.save(metrics);
    }

    // Если в МВД отклонили, то устанавливаем финальный статус в заявлении "отклонено в МВД". Это финальный статус.
    if (Objects.equals(mvd_answer, StatementStatus.REJECTED_IN_MVD)) {
      metrics.setStatus(StatementStatus.REJECTED_IN_MVD);
      metrics.setDateEnd(LocalDateTime.now());
      metricsRepository.save(metrics);
    }

    // Если в МВД не отклонили, то устанавливаем статус "готово в МВД".
    if (Objects.equals(mvd_answer, StatementStatus.READY_IN_MVD)) {
      metrics.setStatus(StatementStatus.READY_IN_MVD);
      metricsRepository.save(metrics);
    }

    return mainEntity;
  }




  public MainEntity payment_duty(Long id) {
    // Получаем сущность с проверкой на существование
    MainEntity mainEntity = mainEntityRepository.findById(id)
      .orElseThrow(() -> new EntityNotFoundException("MainEntity not found with id: " + id));


    // Ставим статус "отправлено в банк".
    // Отправляем в банк --> получаем ответ --> ставим статус, который прислал банк или ошибку --> сохраняем в БД
    mainEntity.getMetrics().setStatus(StatementStatus.SENT_TO_BANK);
    StatementStatus bank_answer = sent_to_bank("что-то отправляем");

    if (bank_answer == null) {
      // Поставили статус "ошибка в банке" и сохранили в БД. Это финальный статус.
      mainEntity.getMetrics().setStatus(StatementStatus.ERROR_IN_BANK);
      mainEntity.getMetrics().setDateEnd(LocalDateTime.now());
      mainEntityRepository.save(mainEntity);
    }

    if (bank_answer == StatementStatus.REJECTED_IN_BANK) {
      mainEntity.getMetrics().setStatus(bank_answer);
      mainEntity.getMetrics().setDateEnd(LocalDateTime.now());
      mainEntityRepository.save(mainEntity);
    }

    mainEntity.getMetrics().setStatus(bank_answer);
    mainEntityRepository.save(mainEntity);

    return mainEntity;
  }




  public MainEntity addFeedback(FeedbackRequest feedbackRequest) {
    // Получаем сущность с проверкой на существование
    MainEntity mainEntity = mainEntityRepository.findById(feedbackRequest.getId())
      .orElseThrow(() -> new EntityNotFoundException("MainEntity not found with id: " + feedbackRequest.getId()));

    // Создаём сущность для комментариев, заполняем её и сохраняем сущность в БД.
    Feedback feedback = Feedback.builder().build();
    feedback.setRating(feedbackRequest.getGrade());
    feedback.setComment(feedbackRequest.getReview());
    feedbackRepository.save(feedback);

    // Сохраняем комментарий в главной сущности и обновляем главную сущность в БД
    mainEntity.setFeedback(feedback);
    mainEntityRepository.save(mainEntity);

    return mainEntity;
  }




  /// Ручки к другим сервисам
  public StatementStatus sent_to_mvd(String message) {
    String url = "http://localhost:8080/api/mvd/verify-passport";
    return restTemplate.postForObject(url, message, StatementStatus.class);
  }


  public StatementStatus sent_to_bank(String message) {
    String url = "http://localhost:8080/api/bank/payment_duty";
    return restTemplate.postForObject(url, message, StatementStatus.class);
  }
}
