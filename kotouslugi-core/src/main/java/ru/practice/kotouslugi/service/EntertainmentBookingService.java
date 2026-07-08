package ru.practice.kotouslugi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.AppointmentRepository;
import ru.practice.kotouslugi.dao.EventRepository;
import ru.practice.kotouslugi.dao.VenueRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.Appointment;
import ru.practice.kotouslugi.model.EventEntity;
import ru.practice.kotouslugi.model.Venue;
import ru.practice.kotouslugi.model.enums.AppointmentStatus;

import java.time.LocalDateTime;
import java.util.Arrays;

@Service
public class EntertainmentBookingService {

  private static final String MNEMONIC = "entertainment";

  private final EventRepository eventRepository;
  private final VenueRepository venueRepository;
  private final AppointmentRepository appointmentRepository;
  private final ObjectMapper objectMapper = new ObjectMapper();

  public EntertainmentBookingService(EventRepository eventRepository,
                                     VenueRepository venueRepository,
                                     AppointmentRepository appointmentRepository) {
    this.eventRepository = eventRepository;
    this.venueRepository = venueRepository;
    this.appointmentRepository = appointmentRepository;
  }

  public boolean supports(String mnemonic) {
    return MNEMONIC.equals(mnemonic);
  }

  public void registerAppointment(String fieldsJson) throws ServiceException {
    JsonNode eventIdNode = findField(fieldsJson, "eventId");
    if (eventIdNode == null) {
      eventIdNode = findField(fieldsJson, "event");
    }
    Integer eventId = extractId(eventIdNode);
    if (eventId == null) {
      throw new ServiceException("Выберите мероприятие для посещения");
    }

    EventEntity event = eventRepository.findById(eventId)
      .orElseThrow(() -> new ServiceException("Выбранное мероприятие не найдено"));

    JsonNode datetimeNode = findField(fieldsJson, "visitDatetime");
    if (datetimeNode == null) {
      datetimeNode = findField(fieldsJson, "time");
    }
    if (datetimeNode == null || datetimeNode.isNull() || datetimeNode.asText().isBlank()) {
      throw new ServiceException("Выберите время посещения");
    }
    String visitDatetime = datetimeNode.asText();

    boolean slotAvailable = Arrays.stream(event.getAvailableSlots().split(","))
      .map(String::trim)
      .anyMatch(slot -> slot.equals(visitDatetime));
    if (!slotAvailable) {
      throw new ServiceException("Выбранное время посещения недоступно");
    }

    Venue venue = venueRepository.findById(event.getVenueId())
      .orElseThrow(() -> new ServiceException("Место проведения не найдено"));

    JsonNode emailNode = findField(fieldsJson, "email");
    String ownerEmail = emailNode != null && !emailNode.isNull() ? emailNode.asText() : null;

    String petName = null;
    JsonNode catNode = findField(fieldsJson, "cat");
    if (catNode != null && !catNode.isNull()) {
      try {
        JsonNode catObject = objectMapper.readTree(catNode.asText());
        if (catObject.has("text")) {
          petName = catObject.get("text").asText();
        }
      } catch (Exception e) {
        throw new ServiceException("Некорректные данные о коте: " + e.getMessage());
      }
    }

    JsonNode telephoneNode = findField(fieldsJson, "telephone");
    String ownerPhone = telephoneNode != null && !telephoneNode.isNull() ? telephoneNode.asText() : null;

    LocalDateTime parsedVisitDatetime;
    try {
      parsedVisitDatetime = LocalDateTime.parse(visitDatetime);
    } catch (Exception e) {
      throw new ServiceException("Некорректный формат времени посещения: " + visitDatetime);
    }

    Appointment appointment = Appointment.builder()
      .venueName(venue.getName())
      .eventName(event.getName())
      .visitDatetime(parsedVisitDatetime)
      .totalCost(event.getPrice())
      .status(AppointmentStatus.CONFIRMED)
      .ownerEmail(ownerEmail)
      .petName(petName)
      .ownerPhone(ownerPhone)
      .build();

    appointmentRepository.save(appointment);
  }

  private Integer extractId(JsonNode node) throws ServiceException {
    if (node == null || node.isNull()) {
      return null;
    }
    if (node.isInt() || node.isLong()) {
      return node.asInt();
    }
    if (node.isTextual()) {
      String text = node.asText();
      if (text.isBlank()) {
        return null;
      }
      try {
        return Integer.parseInt(text);
      } catch (NumberFormatException ignored) {

      }
      try {
        JsonNode wrapped = objectMapper.readTree(text);
        return wrapped.has("id") ? wrapped.get("id").asInt() : null;
      } catch (Exception e) {
        throw new ServiceException("Некорректный формат поля: " + text);
      }
    }
    return null;
  }

  private JsonNode findField(String fieldsJson, String fieldName) throws ServiceException {
    try {
      JsonNode steps = objectMapper.readTree(fieldsJson);
      if (steps.isTextual()) {
        steps = objectMapper.readTree(steps.asText());
      }
      for (JsonNode step : steps) {
        if (step.has(fieldName)) {
          return step.get(fieldName);
        }
      }
      return null;
    } catch (Exception e) {
      throw new ServiceException("Некорректные данные формы: " + e.getMessage());
    }
  }
}
