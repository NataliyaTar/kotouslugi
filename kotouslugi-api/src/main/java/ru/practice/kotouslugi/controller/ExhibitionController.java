package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.*;
import ru.practice.kotouslugi.service.ExhibitionService;
import java.util.List;

@RestController
@RequestMapping("/api/exhibitions")
@Tag(name = "Участие в выставке", description = "Сервис для поиска выставок, регистрации участников и сбора обратной связи")
public class ExhibitionController {

  private final ExhibitionService exhibitionService;

  public ExhibitionController(ExhibitionService exhibitionService) {
    this.exhibitionService = exhibitionService;
  }

  @GetMapping
  @Operation(summary = "Поиск выставок")
  public List<Exhibition> getAll() {
    return exhibitionService.getExhibitions();
  }

  @PostMapping("/{id}/apply")
  @Operation(summary = "Подача заявки")
  public String apply(@PathVariable int id, @RequestBody Requisition requisition) {
    exhibitionService.saveRequisition(requisition);
    return "Заявка на выставку номер " + id + " успешно принята!";
  }

  @PostMapping("/{id}/review")
  @Operation(summary = "Оставление отзыва")
  public String addReview(@PathVariable int id, @RequestBody Review review) {
    review.setExhibitionId(id);
    exhibitionService.saveReview(review);
    return "Ваш отзыв для выставки " + id + " сохранен!";
  }
}
