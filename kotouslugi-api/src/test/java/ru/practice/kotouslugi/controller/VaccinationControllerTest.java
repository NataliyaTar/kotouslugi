package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Cat;
import ru.practice.kotouslugi.model.Vaccine;
import ru.practice.kotouslugi.service.RequisitionService;
import ru.practice.kotouslugi.service.VaccinationService;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class VaccinationControllerTest {
  private MockMvc mockMvc;
  private VaccinationService vaccinationService;
  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    objectMapper = new ObjectMapper();
    vaccinationService = mock(VaccinationService.class);
    VaccinationController controller = new VaccinationController(vaccinationService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  @Test
  public void shouldReturnVaccineList() throws Exception {

    doReturn(
      List.of(getTestVaccine())
    ).when(vaccinationService).getAllVaccines();

    mockMvc.perform(get("/api/vaccination/all")
        .contentType(MediaType.APPLICATION_JSON))
      .andDo(print())
      .andExpect(jsonPath("$[0].id").value(1L))
      .andExpect(jsonPath("$[0].name").value("Против бешенства"));

    verify(vaccinationService).getAllVaccines();
  }

  @Test
  void shouldAddVaccine() throws Exception {
    Vaccine vaccine = getTestVaccine();

    mockMvc.perform(post("/api/vaccination/add")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(vaccine)))
      .andDo(print())
      .andExpect(status().isCreated());

    verify(vaccinationService).addVaccine(any());
  }

  private Vaccine getTestVaccine() {
    return Vaccine.builder()
      .id(1L)
      .name("Против бешенства").build();
  }
}
