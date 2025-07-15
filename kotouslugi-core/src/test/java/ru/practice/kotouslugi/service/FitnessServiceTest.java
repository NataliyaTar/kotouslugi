package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.FitnessRepository;
import ru.practice.kotouslugi.model.Fitness;
import ru.practice.kotouslugi.model.enums.MembershipType;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class FitnessServiceTest {
    private FitnessRepository fitnessRepository;
    private FitnessService fitnessService;

    @BeforeEach
    void setUp() {
        fitnessRepository = mock(FitnessRepository.class);
        fitnessService = new FitnessService(fitnessRepository);
    }

    @Test
    void shouldList() throws Exception {
        when(fitnessRepository.findAll()).thenReturn(
          () -> this.getTestFitnessList().iterator()
        );

        fitnessService.listFitness();

        verify(fitnessRepository).findAll();
    }

    @Test
    void shouldGet() throws Exception {
        when(fitnessRepository.findById(15L)).thenReturn(
            Optional.ofNullable(this.getTestFitness())
        );

        fitnessService.getFitness(15L);

        verify(fitnessRepository).findById(15L);
    }

    private Fitness getTestFitness() {
        return  Fitness.builder()
            .id(15L)
            .fitness_club("Тестовый фитнес-клуб")
            .membership_type(MembershipType.FREE)
            .price(4000)
            .build();
    }


    private List<Fitness> getTestFitnessList() {
        return List.of(
            this.getTestFitness()
        );
    }
}
