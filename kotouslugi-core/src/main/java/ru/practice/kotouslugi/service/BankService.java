package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.model.StatementForPassport;
import ru.practice.kotouslugi.model.enums.StatementStatus;

import java.util.Random;

@Service
public class BankService {
  public StatementStatus payment_duty(String message) {
    int price_of_duty = 500;

    Random random = new Random();
    int userMoney = random.nextInt(400,1001);

    StatementStatus bank_status;
    if (userMoney >= price_of_duty) {
      bank_status = StatementStatus.APPROVED_BY_BANK;
    } else {
      bank_status = StatementStatus.REJECTED_IN_BANK;
    }

    return bank_status;
  }
}
