package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ru.practice.kotouslugi.model.MainEntity;
import ru.practice.kotouslugi.model.StatementForPassport;
import ru.practice.kotouslugi.service.PasswordService;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(PassportController.class)
class PassportControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private PasswordService passwordService;

  private final ObjectMapper objectMapper = new ObjectMapper()
    .registerModule(new JavaTimeModule());


  @Test
  @DisplayName("POST /api/foreign-passport/add-statement-for-passport - успешное создание заявления")
  void addStatementForPassport_shouldReturnCreatedStatement() throws Exception {
    // Подготовка тестовых данных
    StatementForPassport inputStatement = createTestStatement();

    MainEntity expectedResponse = new MainEntity();
    expectedResponse.setStatement(inputStatement);

    // Мокирование сервиса
    when(passwordService.addStatementForPassport(any(StatementForPassport.class)))
      .thenReturn(expectedResponse);

    // Выполнение запроса и проверка результата
    mockMvc.perform(post("/api/foreign-passport/add-statement-for-passport")
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(inputStatement)))
      .andExpect(status().isOk())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.statement.name").value("Коржик"))
      .andExpect(jsonPath("$.statement.sex").value("Male"))
      .andExpect(jsonPath("$.statement.dateOfBirth").value("2020-05-15"))
      .andExpect(jsonPath("$.statement.placeBorn").value("г. Котов, пер. Сиамский, д. 98"))
      .andExpect(jsonPath("$.statement.regAdress").value("г. Котов, пер. Сиамский, д. 98"))
      .andExpect(jsonPath("$.statement.children").value(false))
      .andExpect(jsonPath("$.statement.mvdPlace").value("г. Котов, ул. Ориенталов, д. 2"));
  }


  @Test
  @DisplayName("POST /api/foreign-passport/add-statement-for-passport - ошибка при null полях")
  void addStatementForPassport_withMissingRequiredFields_shouldReturnBadRequest() throws Exception {
    String invalidJson = """
        {
            "name": null,
            "sex": null,
            "dateOfBirth": "2020-05-15",
            "placeBorn": "г. Котов, пер. Сиамский, д. 98",
            "regAdress": "г. Котов, пер. Сиамский, д. 98",
            "children": false,
            "mvdPlace": "г. Котов, ул. Ориенталов, д. 2"
        }
        """;

    mockMvc.perform(post("/api/foreign-passport/add-statement-for-passport")
        .contentType(MediaType.APPLICATION_JSON)
        .content(invalidJson))
      .andExpect(status().isBadRequest());
  }


  @Test
  @DisplayName("POST /api/foreign-passport/add-statement-for-passport - ошибка при пустых обязательных полях")
  void addStatementForPassport_withEmptyRequiredFields_shouldReturnBadRequest() throws Exception {
    String invalidJson = """
        {
            "name": "",
            "sex": "",
            "dateOfBirth": "2020-05-15",
            "placeBorn": "",
            "regAdress": "",
            "children": false,
            "mvdPlace": "г. Котов, ул. Ориенталов, д. 2"
        }
        """;

    mockMvc.perform(post("/api/foreign-passport/add-statement-for-passport")
        .contentType(MediaType.APPLICATION_JSON)
        .content(invalidJson))
      .andExpect(status().isBadRequest());
  }


  @Test
  @DisplayName("POST /api/foreign-passport/add-statement-for-passport - успешное создание с минимальными данными")
  void addStatementForPassport_withMinimalData_shouldReturnCreatedStatement() throws Exception {
    // Подготовка тестовых данных
    StatementForPassport inputStatement = createTestStatement();
    inputStatement.setMvdPlace(null); // Необязательное поле
    inputStatement.setPoshlina(null); // Необязательное поле

    MainEntity expectedResponse = new MainEntity();
    expectedResponse.setStatement(inputStatement);

    // Мокирование сервиса
    when(passwordService.addStatementForPassport(any(StatementForPassport.class)))
      .thenReturn(expectedResponse);

    // Выполнение запроса и проверка результата
    mockMvc.perform(post("/api/foreign-passport/add-statement-for-passport")
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(inputStatement)))
      .andExpect(status().isOk())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.statement.name").value("Коржик"))
      .andExpect(jsonPath("$.statement.sex").value("Male"))
      .andExpect(jsonPath("$.statement.dateOfBirth").value("2020-05-15"))
      .andExpect(jsonPath("$.statement.placeBorn").value("г. Котов, пер. Сиамский, д. 98"))
      .andExpect(jsonPath("$.statement.regAdress").value("г. Котов, пер. Сиамский, д. 98"))
      .andExpect(jsonPath("$.statement.children").value(false))
      .andExpect(jsonPath("$.statement.mvdPlace").doesNotExist());
  }




  private StatementForPassport createTestStatement() {
    StatementForPassport statement = new StatementForPassport();
    statement.setName("Коржик");
    statement.setSex("Male");
    statement.setChildren(false);
    statement.setRegAdress("г. Котов, пер. Сиамский, д. 98");
    statement.setMvdPlace("г. Котов, ул. Ориенталов, д. 2");
    statement.setPlaceBorn("г. Котов, пер. Сиамский, д. 98");
    statement.setDateOfBirth(LocalDate.of(2020, 5, 15));
    return statement;
  }


  private String asJsonString(final Object obj) throws JsonProcessingException {
    return objectMapper.writeValueAsString(obj);
  }
}
