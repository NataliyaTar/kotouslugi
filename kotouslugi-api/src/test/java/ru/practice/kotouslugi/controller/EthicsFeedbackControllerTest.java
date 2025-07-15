package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.service.EthicsFeedbackService;

import static org.mockito.Mockito.mock;

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


}
