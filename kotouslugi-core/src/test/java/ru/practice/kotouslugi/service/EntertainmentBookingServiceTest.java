package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.AppointmentRepository;
import ru.practice.kotouslugi.dao.EventRepository;
import ru.practice.kotouslugi.dao.VenueRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.Appointment;
import ru.practice.kotouslugi.model.EventEntity;
import ru.practice.kotouslugi.model.Venue;
import ru.practice.kotouslugi.model.enums.AppointmentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class EntertainmentBookingServiceTest {

  private EventRepository eventRepository;
  private VenueRepository venueRepository;
  private AppointmentRepository appointmentRepository;
  private EntertainmentBookingService bookingService;

  @BeforeEach
  void setUp() {
    eventRepository = mock(EventRepository.class);
    venueRepository = mock(VenueRepository.class);
    appointmentRepository = mock(AppointmentRepository.class);
    bookingService = new EntertainmentBookingService(eventRepository, venueRepository, appointmentRepository);
  }

  private EventEntity sampleEvent() {
    return EventEntity.builder()
      .id(0)
      .venueId(0)
      .name("Выставка \"Русский пейзаж 19-го века\"")
      .price(new BigDecimal("300.00"))
      .availableSlots("2026-08-08T10:00:00,2026-08-08T14:00:00,2026-08-09T12:00:00")
      .build();
  }

  private Venue sampleVenue() {
    return Venue.builder()
      .id(0)
      .name("Художественный музей им. Крамского")
      .build();
  }

  @Test
  void supports_shouldReturnTrue_forEntertainmentMnemonic() {
    assertThat(bookingService.supports("entertainment")).isTrue();
  }

  @Test
  void supports_shouldReturnFalse_forOtherMnemonic() {
    assertThat(bookingService.supports("vet")).isFalse();
  }

  @Test
  void registerAppointment_shouldSaveAppointment_whenDataIsValid() throws ServiceException {
    when(eventRepository.findById(0)).thenReturn(Optional.of(sampleEvent()));
    when(venueRepository.findById(0)).thenReturn(Optional.of(sampleVenue()));

    String fieldsJson = "[{\"id\":0,\"cat\":\"{\\\"id\\\":1,\\\"text\\\":\\\"Феликс\\\"}\","
      + "\"telephone\":\"89518586559\",\"email\":\"abc@dfg.ru\"},"
      + "{\"id\":1,\"eventId\":0,\"visitDatetime\":\"2026-08-08T10:00:00\"}]";

    bookingService.registerAppointment(fieldsJson);

    org.mockito.ArgumentCaptor<Appointment> captor = org.mockito.ArgumentCaptor.forClass(Appointment.class);
    verify(appointmentRepository).save(captor.capture());
    Appointment saved = captor.getValue();

    assertThat(saved.getVenueName()).isEqualTo("Художественный музей им. Крамского");
    assertThat(saved.getEventName()).isEqualTo("Выставка \"Русский пейзаж 19-го века\"");
    assertThat(saved.getVisitDatetime()).isEqualTo(LocalDateTime.parse("2026-08-08T10:00:00"));
    assertThat(saved.getTotalCost()).isEqualByComparingTo("300.00");
    assertThat(saved.getStatus()).isEqualTo(AppointmentStatus.CONFIRMED);
    assertThat(saved.getOwnerEmail()).isEqualTo("abc@dfg.ru");
    assertThat(saved.getOwnerPhone()).isEqualTo("89518586559");
    assertThat(saved.getPetName()).isEqualTo("Феликс");
  }

  @Test
  void registerAppointment_shouldAcceptEventIdAsWrappedJsonObject() throws ServiceException {
    when(eventRepository.findById(0)).thenReturn(Optional.of(sampleEvent()));
    when(venueRepository.findById(0)).thenReturn(Optional.of(sampleVenue()));

    String fieldsJson = "[{\"id\":0,\"telephone\":\"89518586559\",\"email\":\"abc@dfg.ru\"},"
      + "{\"id\":1,\"eventId\":\"{\\\"id\\\":0,\\\"text\\\":\\\"Мероприятие 0\\\"}\","
      + "\"visitDatetime\":\"2026-08-08T10:00:00\"}]";

    bookingService.registerAppointment(fieldsJson);

    verify(appointmentRepository).save(any(Appointment.class));
  }

  @Test
  void registerAppointment_shouldThrow_whenEventIdMissing() {
    String fieldsJson = "[{\"id\":0,\"telephone\":\"89518586559\",\"email\":\"abc@dfg.ru\"},"
      + "{\"id\":1,\"visitDatetime\":\"2026-08-08T10:00:00\"}]";

    assertThatThrownBy(() -> bookingService.registerAppointment(fieldsJson))
      .isInstanceOf(ServiceException.class)
      .hasMessageContaining("Выберите мероприятие");
  }

  @Test
  void registerAppointment_shouldThrow_whenEventNotFound() {
    when(eventRepository.findById(anyInt())).thenReturn(Optional.empty());

    String fieldsJson = "[{\"id\":0,\"telephone\":\"89518586559\",\"email\":\"abc@dfg.ru\"},"
      + "{\"id\":1,\"eventId\":999,\"visitDatetime\":\"2026-08-08T10:00:00\"}]";

    assertThatThrownBy(() -> bookingService.registerAppointment(fieldsJson))
      .isInstanceOf(ServiceException.class)
      .hasMessageContaining("не найдено");
  }

  @Test
  void registerAppointment_shouldThrow_whenSlotNotAvailable() {
    when(eventRepository.findById(0)).thenReturn(Optional.of(sampleEvent()));

    String fieldsJson = "[{\"id\":0,\"telephone\":\"89518586559\",\"email\":\"abc@dfg.ru\"},"
      + "{\"id\":1,\"eventId\":0,\"visitDatetime\":\"2026-08-08T23:59:00\"}]";

    assertThatThrownBy(() -> bookingService.registerAppointment(fieldsJson))
      .isInstanceOf(ServiceException.class)
      .hasMessageContaining("недоступно");
  }

  @Test
  void registerAppointment_shouldThrow_whenVenueNotFound() {
    when(eventRepository.findById(0)).thenReturn(Optional.of(sampleEvent()));
    when(venueRepository.findById(anyInt())).thenReturn(Optional.empty());

    String fieldsJson = "[{\"id\":0,\"telephone\":\"89518586559\",\"email\":\"abc@dfg.ru\"},"
      + "{\"id\":1,\"eventId\":0,\"visitDatetime\":\"2026-08-08T10:00:00\"}]";

    assertThatThrownBy(() -> bookingService.registerAppointment(fieldsJson))
      .isInstanceOf(ServiceException.class)
      .hasMessageContaining("Место проведения не найдено");
  }

  @Test
  void registerAppointment_shouldThrow_whenVisitDatetimeMissing() {
    when(eventRepository.findById(0)).thenReturn(Optional.of(sampleEvent()));

    String fieldsJson = "[{\"id\":0,\"telephone\":\"89518586559\",\"email\":\"abc@dfg.ru\"},"
      + "{\"id\":1,\"eventId\":0}]";

    assertThatThrownBy(() -> bookingService.registerAppointment(fieldsJson))
      .isInstanceOf(ServiceException.class)
      .hasMessageContaining("время посещения");
  }

  @Test
  void registerAppointment_shouldHandleDoubleEncodedFieldsJson() throws ServiceException {
    when(eventRepository.findById(0)).thenReturn(Optional.of(sampleEvent()));
    when(venueRepository.findById(0)).thenReturn(Optional.of(sampleVenue()));

    String innerArray = "[{\"id\":0,\"telephone\":\"89518586559\",\"email\":\"abc@dfg.ru\"},"
      + "{\"id\":1,\"eventId\":0,\"visitDatetime\":\"2026-08-08T10:00:00\"}]";
    String doubleEncoded = "\"" + innerArray.replace("\"", "\\\"") + "\"";

    bookingService.registerAppointment(doubleEncoded);

    verify(appointmentRepository).save(any(Appointment.class));
  }
}
