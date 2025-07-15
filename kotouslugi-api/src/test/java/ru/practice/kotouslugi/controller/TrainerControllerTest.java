package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Fitness;
import ru.practice.kotouslugi.model.Trainer;
import ru.practice.kotouslugi.model.enums.MembershipType;
import ru.practice.kotouslugi.service.TrainerService;

import java.math.BigDecimal;
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

public class TrainerControllerTest {
    private MockMvc mockMvc;
    private TrainerService trainerService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        trainerService = mock(TrainerService.class);
        TrainerController controller = new TrainerController(trainerService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnTrainerList() throws Exception {
        doReturn(
            List.of(
                this.getTestTrainer()
            )
        ).when(trainerService).listTrainers();

        mockMvc.perform(get("/api/fitness_trainers/list")
            .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L))
            .andExpect(jsonPath("$[0].trainers_name").value("Тренер"))
            .andExpect(jsonPath("$[0].fitness_club.id").value(15L))
            .andExpect(jsonPath("$[0].membership_price").value(5000))
            .andExpect(jsonPath("$[0].membership_type").value("Свободный"));

        verify(trainerService).listTrainers();
    }

    @Test
    void shouldReturnTrainerListByFitnessClub() throws Exception {
        doReturn(
            List.of(
                this.getTestTrainer()
            )
        ).when(trainerService).listTrainersByFitnessClubId(15L);

        mockMvc.perform(get("/api/fitness_trainers/listByFitnessClubId?fitness_club_id=15")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L))
            .andExpect(jsonPath("$[0].trainers_name").value("Тренер"))
            .andExpect(jsonPath("$[0].fitness_club.id").value(15L))
            .andExpect(jsonPath("$[0].membership_price").value(5000))
            .andExpect(jsonPath("$[0].membership_type").value("Свободный"));

        verify(trainerService).listTrainersByFitnessClubId(15L);
    }

    @Test
    void shouldReturnTrainerListByFClubIdAndMType() throws Exception {
        doReturn(
            List.of(
                this.getTestTrainer()
            )
        ).when(trainerService).listTrainersByFClubIdAndMType(15L, MembershipType.FREE);

        mockMvc.perform(get("/api/fitness_trainers/listByFClubIdAndMType?fitness_club_id=15&membership_type=%D0%A1%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L))
            .andExpect(jsonPath("$[0].trainers_name").value("Тренер"))
            .andExpect(jsonPath("$[0].fitness_club.id").value(15L))
            .andExpect(jsonPath("$[0].membership_price").value(5000))
            .andExpect(jsonPath("$[0].membership_type").value("Свободный"));

        verify(trainerService).listTrainersByFClubIdAndMType(15L, MembershipType.FREE);
    }

    Trainer getTestTrainer() {
        Fitness fitness = Fitness.builder()
            .id(15L)
            .fitness_club("Тестовый фитнес-клуб")
            .membership_type(MembershipType.FREE)
            .price(4000)
            .build();

        return Trainer.builder()
            .id(1L)
            .trainers_name("Тренер")
            .fitness_club(fitness)
            .membership_type(MembershipType.FREE)
            .membership_price(BigDecimal.valueOf(5000))
            .build();
    }
}

/*
/list
/listByFitnessClubId
/listByFClubIdAndMType
/get
/delete
*/
