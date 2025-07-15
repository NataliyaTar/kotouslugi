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




@Service
public class PasswordService {
  /// Репозитории
  private final StatementForPassportRepository statementForPassportRepository;
  private final FeedbackRepository feedbackRepository;
  private final MetricsRepository metricsRepository;
  private final MainEntityRepository mainEntityRepository;


  /// Настройка клиентов
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


  /// Блок функций для main ручки: Start
  public MainEntity addStatementForPassport(StatementForPassport statementForPassport) {
    // 1. Сохранение заявления и создание основной сущности
    MainEntity mainEntity = createAndSaveMainEntity(statementForPassport);

    // 2. Инициализация метрик
    initMetrics(mainEntity);

    // 3. Проверка паспорта в МВД
    if (!processMvdVerification(mainEntity)) {
      return mainEntity;
    }

    // 4. Оплата пошлины в банке
    processBankPayment(mainEntity);

    return mainEntity;
  }

  private MainEntity createAndSaveMainEntity(StatementForPassport statementForPassport) {
    statementForPassportRepository.save(statementForPassport);

    MainEntity mainEntity = MainEntity.builder()
      .statement(statementForPassport)
      .build();

    return mainEntityRepository.save(mainEntity);
  }

  private void initMetrics(MainEntity mainEntity) {
    Metrics metrics = Metrics.builder()
      .dateStart(LocalDateTime.now())
      .status(StatementStatus.CREATED)
      .build();

    metricsRepository.save(metrics);
    mainEntity.setMetrics(metrics);
    mainEntityRepository.save(mainEntity);
  }

  private boolean processMvdVerification(MainEntity mainEntity) {
    updateMetricsStatus(mainEntity, StatementStatus.SENT_TO_MVD);

    StatementStatus mvdStatus = mvdClient.verifyPassport("будто что-то отправляем в МВД");

    if (StatementStatus.REJECTED_IN_MVD.equals(mvdStatus)) {
      completeWithStatus(mainEntity, StatementStatus.REJECTED_IN_MVD);
      return false;
    }

    if (!StatementStatus.READY_IN_MVD.equals(mvdStatus)) {
      completeWithStatus(mainEntity, StatementStatus.ERROR_IN_MVD);
      return false;
    }

    updateMetricsStatus(mainEntity, StatementStatus.READY_IN_MVD);
    return true;
  }

  private void processBankPayment(MainEntity mainEntity) {
    updateMetricsStatus(mainEntity, StatementStatus.SENT_TO_BANK);

    StatementStatus bankStatus = bankClient.processPaymentDuty("будто что-то отправляем в Банк");

    if (StatementStatus.APPROVED_BY_BANK.equals(bankStatus)) {
      mainEntity.getStatement().setPoshlina(true);
      completeWithStatus(mainEntity, StatementStatus.APPROVED_BY_BANK);
    } else if (StatementStatus.REJECTED_IN_BANK.equals(bankStatus)) {
      completeWithStatus(mainEntity, StatementStatus.REJECTED_IN_BANK);
    } else {
      completeWithStatus(mainEntity, StatementStatus.ERROR_IN_BANK);
    }
  }

  private void updateMetricsStatus(MainEntity mainEntity, StatementStatus status) {
    mainEntity.getMetrics().setStatus(status);
    metricsRepository.save(mainEntity.getMetrics());
  }

  private void completeWithStatus(MainEntity mainEntity, StatementStatus status) {
    mainEntity.getMetrics().setStatus(status);
    mainEntity.getMetrics().setDateEnd(LocalDateTime.now());
    metricsRepository.save(mainEntity.getMetrics());
    mainEntityRepository.save(mainEntity);
  }
  /// Блок функций для main ручки: End



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
