package ru.practice.kotouslugi.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.EthicsRecord;
import ru.practice.kotouslugi.service.EthicsService;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class EthicsControllerTest {
  private MockMvc mockMvc;
  private EthicsService ethicsService;
  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    ethicsService = mock(EthicsService.class);
    EthicsController controller = new EthicsController(ethicsService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

  }

  @Test
  void shouldAddRecord() throws Exception {
    EthicsRecord ethicsRecord = getTestEthics();

    doReturn(true).when(ethicsService).addEthicsRecord(any());

    mockMvc.perform(post("/api/ethics/add")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(ethicsRecord)))
      .andDo(print())
      .andExpect(status().isOk());

    verify(ethicsService).addEthicsRecord(any());
  }

  @Test
  void shouldAddRecordBadRequest() throws Exception {
    EthicsRecord ethicsRecord = getTestEthics();

    mockMvc.perform(post("/api/ethics/add")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(ethicsRecord)))
      .andDo(print())
      .andExpect(status().isBadRequest());

    verify(ethicsService).addEthicsRecord(any());
  }

  private EthicsRecord getTestEthics() {
    return EthicsRecord.builder()
      .id(1L)
      .catName("Барсик")
      .startTime(LocalDateTime.now())
      .courseType("Основы")
      .teacherName("Анна")
      .teacherAbout("10 лет опыта")
      .ownerName("Иван")
      .phoneNumber("89991112233")
      .email("yaroslav@mail.ru")
      .build();
  }
}
