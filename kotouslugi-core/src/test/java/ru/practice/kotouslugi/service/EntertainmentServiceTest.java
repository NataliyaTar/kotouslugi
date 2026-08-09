package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.EventRepository;
import ru.practice.kotouslugi.dao.VenueRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.EventEntity;
import ru.practice.kotouslugi.model.Venue;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class EntertainmentServiceTest {

  private VenueRepository venueRepository;
  private EventRepository eventRepository;
  private EntertainmentService entertainmentService;

  @BeforeEach
  void setUp() {
    venueRepository = mock(VenueRepository.class);
    eventRepository = mock(EventRepository.class);
    entertainmentService = new EntertainmentService(venueRepository, eventRepository);
  }

  @Test
  void listVenues_shouldReturnAllVenues() {
    Venue venue = Venue.builder().id(0).name("Кинотеатр \"Спартак\"").build();
    when(venueRepository.findAll()).thenReturn(List.of(venue));

    List<Venue> result = entertainmentService.listVenues();

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getName()).isEqualTo("Кинотеатр \"Спартак\"");
    verify(venueRepository).findAll();
  }

  @Test
  void listEventsByVenue_shouldDelegateToRepository() {
    EventEntity event = EventEntity.builder()
      .id(3).venueId(1).name("Гарри Поттер и философский камень")
      .price(new BigDecimal("400.00"))
      .availableSlots("2026-08-08T18:00:00")
      .build();
    when(eventRepository.findByVenueId(1)).thenReturn(List.of(event));

    List<EventEntity> result = entertainmentService.listEventsByVenue(1);

    assertThat(result).containsExactly(event);
    verify(eventRepository).findByVenueId(1);
  }

  @Test
  void getEventById_shouldReturnEvent_whenFound() throws ServiceException {
    EventEntity event = EventEntity.builder()
      .id(0).venueId(0).name("Выставка")
      .price(new BigDecimal("300.00"))
      .availableSlots("2026-08-08T10:00:00")
      .build();
    when(eventRepository.findById(0)).thenReturn(Optional.of(event));

    EventEntity result = entertainmentService.getEventById(0);

    assertThat(result.getName()).isEqualTo("Выставка");
  }

  @Test
  void getEventById_shouldThrow_whenNotFound() {
    when(eventRepository.findById(999)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> entertainmentService.getEventById(999))
      .isInstanceOf(ServiceException.class)
      .hasMessageContaining("не найдено");
  }
}
