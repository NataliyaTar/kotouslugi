package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.HotelRecord;
import ru.practice.kotouslugi.service.CatService;
import ru.practice.kotouslugi.service.HotelRecordService;
import ru.practice.kotouslugi.service.HotelService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class HotelControllerTest {
  private MockMvc mockMvc;
  private HotelRecordService hotelRecordService;
  private CatService catService;
  private HotelService hotelService;
  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    hotelRecordService = mock(HotelRecordService.class);
    catService = mock(CatService.class);
    hotelService = mock(HotelService.class);

    objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());

    HotelController controller = new HotelController(hotelRecordService, catService, hotelService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  @Test
  void shouldCheckSpace() throws Exception {
    Long hotelId = 1L;
    LocalDateTime startDate = LocalDateTime.now().plusDays(1);
    LocalDateTime endDate = startDate.plusDays(3);

    doReturn(true).when(hotelRecordService).checkSpace(hotelId, startDate, endDate);

    mockMvc.perform(get("/api/hotel/check-space")
        .param("hotelId", hotelId.toString())
        .param("startDate", startDate.toString())
        .param("endDate", endDate.toString())
        .contentType(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isOk())
      .andExpect(content().string("true"));

    verify(hotelRecordService).checkSpace(hotelId, startDate, endDate);
  }

  @Test
  void shouldGetOptions() throws Exception {
    doReturn(List.of("Cat1", "Cat2")).when(catService).listCat();
    doReturn(List.of("Hotel1", "Hotel2")).when(hotelService).listHotels();

    mockMvc.perform(get("/api/hotel/options")
        .contentType(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.cats[0]").value("Cat1"))
      .andExpect(jsonPath("$.hotels[0]").value("Hotel1"));

    verify(catService).listCat();
    verify(hotelService).listHotels();
  }

  @Test
  void shouldBookOverexposure() throws Exception {
    HotelRecord record = getTestRecord();
    HotelRecord savedRecord = getTestRecord();
    savedRecord.setId(42L);

    doReturn(savedRecord).when(hotelRecordService).saveRecord(any());

    mockMvc.perform(post("/api/hotel/book")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(record)))
      .andDo(print())
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.message").value("Котик успешно записан на передержку!"))
      .andExpect(jsonPath("$.recordId").value(42));

    verify(hotelRecordService).saveRecord(any());
  }

  private HotelRecord getTestRecord() {
    HotelRecord record = new HotelRecord();
    record.setCatId(1L);
    record.setHotelId(1L);
    record.setRecordStart(LocalDateTime.now().plusDays(1));
    record.setRecordFinish(LocalDateTime.now().plusDays(3));
    return record;
  }
}
