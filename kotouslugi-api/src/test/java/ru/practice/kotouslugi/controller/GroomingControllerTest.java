package ru.practice.kotouslugi.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Grooming;
import ru.practice.kotouslugi.service.GroomingService;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GroomingControllerTest {
  private MockMvc mockMvc;
  private GroomingService groomingService;

  @BeforeEach
  void setUp() {
    groomingService = mock(GroomingService.class);
    GroomingController controller = new GroomingController(groomingService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  @Test
  void shouldAddGrooming() throws Exception {
    Grooming grooming = new Grooming();
    grooming.setId(1L);
    grooming.setCat("Барсик");
    grooming.setPhoneNumber("1234567890");
    grooming.setEmail("test@example.com");
    grooming.setGroomer("Иван Иванов");
    grooming.setDate("2023-07-18");
    grooming.setTime("10:00");

    doReturn(1L).when(groomingService).addGrooming(any(Grooming.class));

    mockMvc.perform(post("/api/grooming/add")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"id\":1,\"cat\":\"Барсик\",\"phoneNumber\":\"1234567890\",\"email\":\"test@example.com\",\"groomer\":\"Иван Иванов\",\"date\":\"2023-07-18\",\"time\":\"10:00\"}"))
      .andDo(print())
      .andExpect(status().isOk())
      .andExpect(jsonPath("$").value(1L));

    verify(groomingService).addGrooming(any(Grooming.class));
  }
}
