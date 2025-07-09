package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.model.StatementForPassport;
import ru.practice.kotouslugi.model.enums.MvdProcessingStatus;

import java.util.Random;

@Service
public class MvdService {
  public StatementForPassport verify_in_mvd(StatementForPassport statementForPassport) throws InterruptedException {
    Random random = new Random();
    int delay = 10000 + random.nextInt(2000); // Задержка от 1 до 3 секунд
    Thread.sleep(delay);

    statementForPassport.setMvdProcessingStatus(MvdProcessingStatus.READY);

    return statementForPassport;
  }
}
