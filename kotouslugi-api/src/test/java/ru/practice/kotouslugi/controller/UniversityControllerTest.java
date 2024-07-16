package ru.practice.kotouslugi.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.University;
import ru.practice.kotouslugi.service.UniversityService;

import java.util.List;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UniversityControllerTest {
  private MockMvc mockMvc;
  private UniversityService universityService;

  @BeforeEach
  void setUp() {
    universityService = mock(UniversityService.class);
    UniversityController controller = new UniversityController(universityService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  @Test
  void shouldReturnUniversityListByExamAmount() throws Exception {
    Integer score = 400;

    doReturn(
      List.of(
        University.builder()
          .idUniversity(1L)
          .universityName("МГУ имени М.В. Ломоносова")
          .universityScore(400)
          .build()
      )
    ).when(universityService).findUniversitiesByScore(score);

    mockMvc.perform(get("/api/university/eligible")
      .param("score", score.toString())
      .contentType(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].idUniversity").value(1L))
      .andExpect(jsonPath("$[0].universityName").value("МГУ имени М.В. Ломоносова"))
      .andExpect(jsonPath("$[0].universityScore").value(400));

    verify(universityService).findUniversitiesByScore(score);
  }
}
