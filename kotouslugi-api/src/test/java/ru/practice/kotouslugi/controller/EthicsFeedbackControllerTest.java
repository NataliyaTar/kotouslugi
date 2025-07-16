package ru.practice.kotouslugi.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.EthicsFeedback;
import ru.practice.kotouslugi.service.EthicsFeedbackService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class EthicsFeedbackControllerTest {
  private MockMvc mockMvc;
  private EthicsFeedbackService feedbackService;
  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    objectMapper = new ObjectMapper();
    feedbackService = mock(EthicsFeedbackService.class);
    EthicsFeedbackController controller = new EthicsFeedbackController(feedbackService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  @Test
  void shouldAddEthicsFeedback() throws Exception {
    EthicsFeedback feedback = getTestFeedback();

    doReturn(true).when(feedbackService).addEthicsFeedback(any());

    mockMvc.perform(post("/api/ethicsFeedback/add")
          .contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(feedback)))
      .andDo(print())
      .andExpect(status().isOk());

    verify(feedbackService).addEthicsFeedback(any());
  }

  @Test
  void shouldAddEthicsFeedbackBadRequest() throws Exception {
    EthicsFeedback feedback = getTestFeedback();

    mockMvc.perform(post("/api/ethicsFeedback/add")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(feedback)))
      .andDo(print())
      .andExpect(status().isBadRequest());

    verify(feedbackService).addEthicsFeedback(any());
  }

  @Test
  void shouldReturnEthicsFeedbackList() throws Exception {

    doReturn(true).when(feedbackService).addEthicsFeedback(any());

    doReturn(List.of(getTestFeedback())).when(feedbackService).getAllFeedbacks();

    mockMvc.perform(get("/api/ethicsFeedback/all") // ← исправили путь
        .contentType(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].id").value(1L))
      .andExpect(jsonPath("$[0].rating").value(5));

    verify(feedbackService).getAllFeedbacks();
  }


  private EthicsFeedback getTestFeedback() {
    return EthicsFeedback.builder()
      .id(1L)
      .rating(5)
      .comment("Топчик")
      .build();
  }

}
