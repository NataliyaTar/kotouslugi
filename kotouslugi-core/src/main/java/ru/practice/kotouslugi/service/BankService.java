package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.model.enums.StatementStatus;

import java.util.Random;

@Service
public class BankService {
  public StatementStatus paymentDuty(String message) throws InterruptedException {
    Random random = new Random();
    int delay = 1000 + random.nextInt(2000);
    Thread.sleep(delay);


    int priceOfDuty = 500;

    int userMoney = random.nextInt(400,1001);

    StatementStatus bankStatus;
    if (userMoney >= priceOfDuty) {
      bankStatus = StatementStatus.APPROVED_BY_BANK;
    } else {
      bankStatus = StatementStatus.REJECTED_IN_BANK;
    }

    return bankStatus;
  }
}
