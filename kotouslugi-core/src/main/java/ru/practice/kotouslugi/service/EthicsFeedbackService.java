package ru.practice.kotouslugi.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.EthicsFeedbackRepository;
import ru.practice.kotouslugi.model.EthicsFeedback;

import java.util.List;


@Service
public class EthicsFeedbackService {
  private final EthicsFeedbackRepository ethicsFeedbackRepository;

  public EthicsFeedbackService(EthicsFeedbackRepository ethicsFeedbackRepository) {
    this.ethicsFeedbackRepository = ethicsFeedbackRepository;
  }

  @Transactional
  public boolean addEthicsFeedback(EthicsFeedback ethicsFeedback) {
    ethicsFeedbackRepository.save(ethicsFeedback);
    return true;
  }
  public List<EthicsFeedback> getAllFeedbacks() {
    return ethicsFeedbackRepository.findAll();
  }
}
