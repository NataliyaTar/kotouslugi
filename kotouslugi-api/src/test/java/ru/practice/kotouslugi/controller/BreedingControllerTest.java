package ru.practice.kotouslugi.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Breeding;
import ru.practice.kotouslugi.service.BreedingService;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class BreedingControllerTest {
  private MockMvc mockMvc;
  private BreedingService breedingService;

  @BeforeEach
  void setUp() {
    breedingService = mock(BreedingService.class);
    BreedingController controller = new BreedingController(breedingService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  @Test
  void shouldReturnMatchesList() throws Exception {

    Breeding partner = new Breeding();
    partner.setId(2L);
    partner.setBreed("Британская");
    partner.setCity("Москва");
    partner.setGender("MALE");
    doReturn(List.of(partner)).when(breedingService).findMatches(1L);


    mockMvc.perform(get("/api/breeding/matches")
        .param("profileId", "1")
        .contentType(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(status().isOk()) // нужен статус 200
      .andExpect(jsonPath("$[0].id").value(2L))
      .andExpect(jsonPath("$[0].breed").value("Британская"));

    // Проверяем, что метод сервиса действительно вызывался
    verify(breedingService).findMatches(1L);
  }
}
