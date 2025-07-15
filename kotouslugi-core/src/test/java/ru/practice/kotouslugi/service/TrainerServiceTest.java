package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.TrainerRepository;
import ru.practice.kotouslugi.model.Fitness;
import ru.practice.kotouslugi.model.Trainer;
import ru.practice.kotouslugi.model.enums.MembershipType;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class TrainerServiceTest {
    private TrainerRepository trainerRepository;
    private TrainerService trainerService;

    @BeforeEach
    void setUp() {
        trainerRepository = mock(TrainerRepository.class);
        trainerService = new TrainerService(trainerRepository);
    }

    @Test
    void shouldList() throws Exception {
        when(trainerRepository.findAll()).thenReturn(
            () -> this.getTestTrainerList().iterator()
        );

        trainerService.listTrainers();

        verify(trainerRepository).findAll();
    }

    @Test
    void shouldGet() throws Exception {
        when(trainerRepository.findById(1L)).thenReturn(
            Optional.ofNullable(this.getTestTrainer())
        );

        trainerService.getTrainer(1L);

        verify(trainerRepository).findById(1L);
    }

    private Trainer getTestTrainer() {
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


    private List<Trainer> getTestTrainerList() {
        return List.of(
            this.getTestTrainer()
        );
    }
}
