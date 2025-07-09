package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.model.StatementForPassport;

import java.util.Random;

@Service
public class BankService {
  public StatementForPassport payment_duty(StatementForPassport statementForPassport) {
    int price_of_duty = 500;

    Random random = new Random();
    int userMoney = random.nextInt(400,1001);

    if (userMoney >= price_of_duty) {
      statementForPassport.setPoshlina(true);
    }

    return statementForPassport;
  }
}
