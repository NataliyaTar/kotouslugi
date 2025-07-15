package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.model.enums.StatementStatus;

import java.util.Random;

@Service
public class MvdService {
  public StatementStatus verifyInMVD(String message) throws InterruptedException {
    Random random = new Random();
    int delay = 1000 + random.nextInt(2000);
    Thread.sleep(delay);

    double randomValue = Math.random();

    return (randomValue < 0.7) ? StatementStatus.READY_IN_MVD : StatementStatus.REJECTED_IN_MVD;
  }
}
