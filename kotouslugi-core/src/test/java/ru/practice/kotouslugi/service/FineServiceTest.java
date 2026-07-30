package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.CatRepository;
import ru.practice.kotouslugi.dao.FineRepository;
import ru.practice.kotouslugi.model.Cat;
import ru.practice.kotouslugi.model.Fine;
import ru.practice.kotouslugi.model.enums.FineStatus;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FineServiceTest {
    private FineRepository fineRepository;
    private CatRepository catRepository;
    private FineService fineService;

    @BeforeEach
    void setUp() {
        fineRepository = mock(FineRepository.class);
        catRepository = mock(CatRepository.class);
        fineService = new FineService(fineRepository, catRepository);
    }

    @Test
    void shouldReturnFineList() {
        when(fineRepository.findAll()).thenReturn(() -> List.of(getTestFine()).iterator());

        assertEquals(1, fineService.listFines().size());
        verify(fineRepository).findAll();
    }

    @Test
    void shouldReturnFinesByCat() {
        when(fineRepository.findByCatId(1L)).thenReturn(List.of(getTestFine()));

        assertEquals(1, fineService.listFinesByCat(1L).size());
        verify(fineRepository).findByCatId(1L);
    }

    @Test
    void shouldAddFine() {
        when(catRepository.findById(1L)).thenReturn(Optional.of(new Cat()));
        when(fineRepository.save(any())).thenReturn(getTestFine());

        assertEquals(1L, fineService.addFine(getTestFine()));
        verify(fineRepository).save(any());
    }

    @Test
    void shouldNotAddFineWhenCatNotFound() {
        when(catRepository.findById(any())).thenReturn(Optional.empty());

        assertNull(fineService.addFine(getTestFine()));
        verify(fineRepository, never()).save(any());
    }

    @Test
    void shouldPayFine() {
        Fine fine = getTestFine();
        when(fineRepository.findById(1L)).thenReturn(Optional.of(fine));
        when(fineRepository.save(any())).thenReturn(fine);

        assertEquals(FineStatus.PAID, fineService.payFine(1L).getStatus());
        verify(fineRepository).save(fine);
    }

    private Fine getTestFine() {
        return Fine.builder()
            .id(1L)
            .catId(1L)
            .reason("Порча мебели когтями")
            .amount(500)
            .status(FineStatus.UNPAID)
            .build();
    }
}
