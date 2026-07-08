package ru.practice.kotouslugi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.Exhibition;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/exhibitions")
public class ExhibitionController {

  @GetMapping("/list")
  public List<Exhibition> getList() {
    List<Exhibition> list = new ArrayList<>();

    // Выставка №1
    Exhibition ex1 = new Exhibition();
    ex1.setId(1L);
    ex1.setName("Международная выставка «Кубок Пушистых»");
    ex1.setDate("15.08.2026");
    ex1.setCity("Москва");
    ex1.setSystem("WCF");
    ex1.setOrganizer("Клуб 'Котофей'");
    ex1.setCost("2500 руб.");
    ex1.setDeadline("10.08.2026");
    list.add(ex1);

    // Выставка №2
    Exhibition ex2 = new Exhibition();
    ex2.setId(2L);
    ex2.setName("Всероссийский смотр «Усы и Лапы»");
    ex2.setDate("20.09.2026");
    ex2.setCity("Санкт-Петербург");
    ex2.setSystem("FIFe");
    ex2.setOrganizer("ЛенКотоСоюз");
    ex2.setCost("1800 руб.");
    ex2.setDeadline("15.09.2026");
    list.add(ex2);

    return list;
  }
}
