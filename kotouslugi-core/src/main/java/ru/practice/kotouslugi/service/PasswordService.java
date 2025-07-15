package ru.practice.kotouslugi.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.practice.kotouslugi.client.BankClient;
import ru.practice.kotouslugi.client.MVDClient;
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

  private MVDClient mvdClient;
  private BankClient bankClient;

  @Autowired
  public void SomeService(MVDClient mvdClient, BankClient bankClient) {
    this.mvdClient = mvdClient;
    this.bankClient = bankClient;
  }

  /// Настройка сервиса
  public PasswordService(StatementForPassportRepository statementForPassportRepository,
                         FeedbackRepository feedbackRepository,
                         MetricsRepository metricsRepository,
                         MainEntityRepository mainEntityRepository,
                         RestTemplate restTemplate, MVDClient mvdClient, BankClient bankClient) {
    this.statementForPassportRepository = statementForPassportRepository;
    this.feedbackRepository = feedbackRepository;
    this.metricsRepository = metricsRepository;
    this.mainEntityRepository = mainEntityRepository;
    this.restTemplate = restTemplate;
    this.mvdClient = mvdClient;
    this.bankClient = bankClient;
  }




  /// Основные функции сервиса
  public MainEntity addStatementForPassport(StatementForPassport statementForPassport) {
    // 1. Сохраняем заявление
    statementForPassportRepository.save(statementForPassport);

    // 2. Создаем основную сущность
    MainEntity mainEntity = MainEntity.builder()
      .statement(statementForPassport)
      .build();
    mainEntityRepository.save(mainEntity);

    // 3. Инициализируем метрики
    Metrics metrics = Metrics.builder()
      .dateStart(LocalDateTime.now())
      .status(StatementStatus.CREATED)
      .build();
    metricsRepository.save(metrics);

    mainEntity.setMetrics(metrics);
    mainEntityRepository.save(mainEntity);

    // 4. Проверка паспорта в МВД
    metrics.setStatus(StatementStatus.SENT_TO_MVD);
    metricsRepository.save(metrics);

    StatementStatus mvdStatus = mvdClient.verifyPassport("типо отправляем какое-то сообщение в МВД");

    // 5. Обработка ответа от МВД
    if (StatementStatus.REJECTED_IN_MVD.equals(mvdStatus)) {
      metrics.setStatus(StatementStatus.REJECTED_IN_MVD);
      metrics.setDateEnd(LocalDateTime.now());
      metricsRepository.save(metrics);
      return mainEntity;
    }

    if (!StatementStatus.READY_IN_MVD.equals(mvdStatus)) {
      metrics.setStatus(StatementStatus.ERROR_IN_MVD);
      metrics.setDateEnd(LocalDateTime.now());
      metricsRepository.save(metrics);
      return mainEntity;
    }

    // 6. Успешная проверка в МВД
    metrics.setStatus(StatementStatus.READY_IN_MVD);
    metricsRepository.save(metrics);

    // 7. Оплата пошлины в банке
    metrics.setStatus(StatementStatus.SENT_TO_BANK);
    metricsRepository.save(metrics);

    StatementStatus bankStatus = bankClient.processPaymentDuty("типо что-то отправили в банк");

    // 8. Обработка ответа от банка
    if (StatementStatus.APPROVED_BY_BANK.equals(bankStatus)) {
      mainEntity.getStatement().setPoshlina(true);
      metrics.setStatus(StatementStatus.APPROVED_BY_BANK);
    } else if (StatementStatus.REJECTED_IN_BANK.equals(bankStatus)) {
      metrics.setStatus(StatementStatus.REJECTED_IN_BANK);
    } else {
      metrics.setStatus(StatementStatus.ERROR_IN_BANK);
    }

    metrics.setDateEnd(LocalDateTime.now());
    metricsRepository.save(metrics);
    mainEntityRepository.save(mainEntity);

    return mainEntity;
  }



  /// Не используется
  public MainEntity paymentDuty(Long id) {
    // Получаем сущность с проверкой на существование
    MainEntity mainEntity = mainEntityRepository.findById(id)
      .orElseThrow(() -> new EntityNotFoundException("MainEntity not found with id: " + id));


    // Ставим статус "отправлено в банк".
    // Отправляем в банк --> получаем ответ --> ставим статус, который прислал банк или ошибку --> сохраняем в БД
    mainEntity.getMetrics().setStatus(StatementStatus.SENT_TO_BANK);
    StatementStatus bankAnswer = sentToBank("что-то отправляем");

    if (bankAnswer == null) {
      // Поставили статус "ошибка в банке" и сохранили в БД. Это финальный статус.
      mainEntity.getMetrics().setStatus(StatementStatus.ERROR_IN_BANK);
      mainEntity.getMetrics().setDateEnd(LocalDateTime.now());
      mainEntityRepository.save(mainEntity);
    }

    if (bankAnswer == StatementStatus.REJECTED_IN_BANK) {
      mainEntity.getMetrics().setStatus(bankAnswer);
      mainEntity.getMetrics().setDateEnd(LocalDateTime.now());
      mainEntityRepository.save(mainEntity);
    }

    mainEntity.getMetrics().setStatus(bankAnswer);
    // Меняет статус в пошлине
    mainEntity.getStatement().setPoshlina(true);
    mainEntityRepository.save(mainEntity);

    return mainEntity;
  }



  /// Не используется
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



  /// Не используется
  public StatementStatus sentToBank(String message) {
    String url = "http://localhost:8080/api/bank/payment_duty";
    return restTemplate.postForObject(url, message, StatementStatus.class);
  }
}
