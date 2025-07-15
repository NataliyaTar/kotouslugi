package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Fitness;
import ru.practice.kotouslugi.model.enums.MembershipType;
import ru.practice.kotouslugi.service.FitnessService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class FitnessControllerTest {
    private MockMvc mockMvc;              // для тестирования Spring MVC
    private FitnessService fitnessService;    // Для работы с фитнес-клубами
    private ObjectMapper objectMapper;    // Для преобразования в JSON

    // Создается преобразователь JSON, заглушка FitnessService и контроллер, который будет работать с заглушкой
    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        fitnessService = mock(FitnessService.class);
        FitnessController controller = new FitnessController(fitnessService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnFitnessList() throws Exception {
        // Вернуть список из тестового клуба когда запрошен
        doReturn(
            List.of(
                this.getTestFitness()
            )
        ).when(fitnessService).listFitness();

        // Сымитировать запрос к API:
        // обратиться (get) к /api/fitness_club/list, ожидать JSON
        // вывести полученную информацию
        // Ожидать ответ сервера ОК (200) и сравнить все поля с заданными в getTestFitness
        mockMvc.perform(get("/api/fitness_club/list")
          .contentType(MediaType.APPLICATION_JSON))
          .andDo(print())
          .andExpect(status().isOk())
          .andExpect(jsonPath("$[0].id").value(15L))
          .andExpect(jsonPath("$[0].fitness_club").value("Тестовый фитнес-клуб"))
          .andExpect(jsonPath("$[0].membership_type").value("Свободный"))
          .andExpect(jsonPath("$[0].price").value(4000));

        verify(fitnessService).listFitness();
    }

    @Test
    void shouldAddFitness() throws Exception {
        Fitness fitness = this.getTestFitness();

        mockMvc.perform(post("/api/fitness_club/add")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(fitness)))
            .andDo(print())
            .andExpect(status().isOk());

        verify(fitnessService).addFitness(any());
    }

    @Test
    void shouldGetFitness() throws Exception {
        doReturn(this.getTestFitness()).when(fitnessService).getFitness(15L);

        mockMvc.perform(get("/api/fitness_club/get?id=15")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());

        verify(fitnessService).getFitness(15L);
    }

    @Test
    void shouldDeleteFitness() throws Exception {
        doNothing().when(fitnessService).deleteFitness(15L);

        mockMvc.perform(delete("/api/fitness_club/delete?id=15")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());

        verify(fitnessService).deleteFitness(any());
    }

    // возвращает объект для проведения тестов
    private Fitness getTestFitness() {
        return Fitness.builder()
          .id(15L)
          .fitness_club("Тестовый фитнес-клуб")
          .membership_type(MembershipType.FREE)
          .price(4000)
          .build();
    }
}
