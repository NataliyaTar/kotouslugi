package ru.practice.kotouslugi.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.EventEntity;
import ru.practice.kotouslugi.model.Venue;
import ru.practice.kotouslugi.service.EntertainmentService;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class EntertainmentControllerTest {

  private MockMvc mockMvc;
  private EntertainmentService entertainmentService;

  @BeforeEach
  void setUp() {
    entertainmentService = mock(EntertainmentService.class);
    EntertainmentController controller = new EntertainmentController(entertainmentService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  @Test
  void listVenues_shouldReturnVenuesList() throws Exception {
    doReturn(
      List.of(Venue.builder().id(0).name("Художественный музей им. Крамского").build())
    ).when(entertainmentService).listVenues();

    mockMvc.perform(get("/api/entertainment/venues")
        .contentType(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].id").value(0))
      .andExpect(jsonPath("$[0].name").value("Художественный музей им. Крамского"));

    verify(entertainmentService).listVenues();
  }

  @Test
  void listEventsByVenue_shouldReturnEventsForVenue() throws Exception {
    doReturn(
      List.of(EventEntity.builder()
        .id(3).venueId(1).name("Гарри Поттер и философский камень")
        .price(new BigDecimal("400.00"))
        .availableSlots("2026-08-08T18:00:00,2026-08-08T20:30:00")
        .build())
    ).when(entertainmentService).listEventsByVenue(1);

    mockMvc.perform(get("/api/entertainment/venues/1/events")
        .contentType(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].name").value("Гарри Поттер и философский камень"))
      .andExpect(jsonPath("$[0].price").value(400.00));

    verify(entertainmentService).listEventsByVenue(1);
  }

  @Test
  void getEventById_shouldReturnEvent_whenFound() throws Exception {
    doReturn(
      EventEntity.builder()
        .id(0).venueId(0).name("Выставка \"Русский пейзаж 19-го века\"")
        .price(new BigDecimal("300.00"))
        .availableSlots("2026-08-08T10:00:00")
        .build()
    ).when(entertainmentService).getEventById(0);

    mockMvc.perform(get("/api/entertainment/events/0")
        .contentType(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.name").value("Выставка \"Русский пейзаж 19-го века\""));

    verify(entertainmentService).getEventById(0);
  }

  @Test
  void getEventById_shouldReturn500_whenEventNotFound() throws Exception {
    doThrow(new ServiceException("Мероприятие не найдено: 999"))
      .when(entertainmentService).getEventById(999);

    mockMvc.perform(get("/api/entertainment/events/999")
        .contentType(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isInternalServerError());

    verify(entertainmentService).getEventById(999);
  }
}
