package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.model.FP.ForeignPassword;
import ru.practice.kotouslugi.model.FP.PersonalData;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class MvdEmulatorService {

  public ForeignPassword sent_to_mvd(ForeignPassword foreignPassword) {
    simulateProcessingDelay();

    return processForeignPasswordRequest(foreignPassword);
  }

  private void simulateProcessingDelay() {
    try {
      Random random = new Random();
      int delay = 10000 + random.nextInt(2000); // Задержка от 1 до 3 секунд
      Thread.sleep(delay);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    }
  }

  private ForeignPassword processForeignPasswordRequest(ForeignPassword foreignPassword) {
    /// Сделать логику выставления статуса.///
    foreignPassword.getProcessingStatus().setMvdProcessingStatus("Одобрено");

    return foreignPassword;
  }
}
