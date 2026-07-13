package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.Exhibition;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.Review;
import ru.practice.kotouslugi.service.ExhibitionService;
import ru.practice.kotouslugi.service.RequisitionService;
import java.util.List;

@RestController
@RequestMapping("/api/exhibitions")
@Tag(name = "Участие в выставке", description = "Сервис для поиска выставок, регистрации участников и сбора обратной связи")
public class ExhibitionController {

  private final ExhibitionService exhibitionService;
  private final RequisitionService requisitionService;

  public ExhibitionController(ExhibitionService exhibitionService, RequisitionService requisitionService) {
    this.exhibitionService = exhibitionService;
    this.requisitionService = requisitionService;
  }

  @GetMapping
  @Operation(summary = "Поиск выставок")
  public List<Exhibition> getAll() {
    return exhibitionService.getExhibitions();
  }

  @PostMapping("/{id}/apply")
  @Operation(summary = "Подача заявки")
  public String apply(@PathVariable int id, @RequestBody Requisition requisition) {
    int newId = requisitionService.createRequisition(requisition);
    return "Заявка на выставку номер " + id + " успешно принята! ID новой заявки: " + newId;
  }

  @PostMapping("/{id}/review")
  @Operation(summary = "Оставление отзыва")
  public String addReview(@PathVariable int id, @RequestBody Review review) {
    review.setExhibitionId(id);
    exhibitionService.saveReview(review);
    return "Ваш отзыв для выставки " + id + " сохранен!";
  }
}
