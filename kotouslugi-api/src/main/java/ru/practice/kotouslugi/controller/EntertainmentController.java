package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.EventEntity;
import ru.practice.kotouslugi.model.Venue;
import ru.practice.kotouslugi.service.EntertainmentService;

import java.util.List;

@RestController
@RequestMapping("/api/entertainment")
@Tag(name = "EntertainmentController", description = "Методы для услуги записи в культурное/ развлекательное место")
public class EntertainmentController extends BaseController {
  private final EntertainmentService entertainmentService;

  public EntertainmentController(EntertainmentService entertainmentService) {
    this.entertainmentService = entertainmentService;
  }

  @GetMapping(value = "/venues", produces = "application/json")
  @ResponseBody
  @Operation(summary = "Список культурных/ развлекательных мест")
  public ResponseEntity<List<Venue>> listVenues() {
    return wrapper((s) -> entertainmentService.listVenues());
  }

  @GetMapping(value = "/venues/{venueId}/events", produces = "application/json")
  @ResponseBody
  @Operation(summary = "Список мероприятий выбранного места")
  public ResponseEntity<List<EventEntity>> listEventsByVenue(
    @Parameter(name = "venueId", required = true) @PathVariable int venueId) {
    return wrapper((s) -> entertainmentService.listEventsByVenue(venueId));
  }

  @GetMapping(value = "/events/{eventId}", produces = "application/json")
  @ResponseBody
  @Operation(summary = "Мероприятие по идентификатору (цена и доступное время)")
  public ResponseEntity<EventEntity> getEventById(
    @Parameter(name = "eventId", required = true) @PathVariable int eventId) {
    return wrapper((s) -> entertainmentService.getEventById(eventId));
  }
}
