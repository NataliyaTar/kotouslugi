package ru.practice.kotouslugi.controller;

import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.Application;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

  @PostMapping("/create")
  public String createApplication(@RequestBody Application application) {
    System.out.println("Получена новая заявка: " + application.getCatName());
    System.out.println("Телефон: " + application.getPhone());

    return "Заявка успешно принята!";
  }
}
