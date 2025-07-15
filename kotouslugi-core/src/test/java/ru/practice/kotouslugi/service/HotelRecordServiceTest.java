package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.HotelRecordRepository;
import ru.practice.kotouslugi.model.HotelRecord;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class HotelRecordServiceTest {

    private HotelRecordRepository hotelRecordRepository;
    private HotelRecordService hotelRecordService;

    @BeforeEach
    void setUp() {
        hotelRecordRepository = mock(HotelRecordRepository.class);
        hotelRecordService = new HotelRecordService(hotelRecordRepository);
    }

    @Test
    void checkSpace_shouldReturnTrue_whenNoOverlappingRecords() {
        Long hotelId = 1L;
        LocalDateTime start = LocalDateTime.of(2025, 7, 20, 10, 0);
        LocalDateTime finish = LocalDateTime.of(2025, 7, 25, 10, 0);

        when(hotelRecordRepository.findByHotelIdAndRecordFinishAfterAndRecordStartBefore(hotelId, start, finish))
            .thenReturn(Collections.emptyList());

        boolean result = hotelRecordService.checkSpace(hotelId, start, finish);

        assertThat(result).isTrue();
        verify(hotelRecordRepository).findByHotelIdAndRecordFinishAfterAndRecordStartBefore(hotelId, start, finish);
    }

    @Test
    void checkSpace_shouldReturnFalse_whenThereAreOverlappingRecords() {
        Long hotelId = 1L;
        LocalDateTime start = LocalDateTime.of(2025, 7, 20, 10, 0);
        LocalDateTime finish = LocalDateTime.of(2025, 7, 25, 10, 0);

        HotelRecord overlapping = HotelRecord.builder()
            .id(1L)
            .hotelId(hotelId)
            .catId(5L)
            .recordStart(start.minusDays(1))
            .recordFinish(start.plusDays(2))
            .recordStatus("ACTIVE")
            .build();

        when(hotelRecordRepository.findByHotelIdAndRecordFinishAfterAndRecordStartBefore(hotelId, start, finish))
            .thenReturn(List.of(overlapping));

        boolean result = hotelRecordService.checkSpace(hotelId, start, finish);

        assertThat(result).isFalse();
        verify(hotelRecordRepository).findByHotelIdAndRecordFinishAfterAndRecordStartBefore(hotelId, start, finish);
    }

    @Test
    void saveRecord_shouldSetStatusAndSaveRecord() {
        HotelRecord record = HotelRecord.builder()
            .id(null)
            .hotelId(1L)
            .catId(2L)
            .recordStart(LocalDateTime.now())
            .recordFinish(LocalDateTime.now().plusDays(1))
            .build();

        HotelRecord savedRecord = HotelRecord.builder()
            .id(10L)
            .hotelId(record.getHotelId())
            .catId(record.getCatId())
            .recordStart(record.getRecordStart())
            .recordFinish(record.getRecordFinish())
            .recordStatus("ACTIVE")
            .build();

        when(hotelRecordRepository.save(any())).thenReturn(savedRecord);

        HotelRecord result = hotelRecordService.saveRecord(record);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getRecordStatus()).isEqualTo("ACTIVE");
        verify(hotelRecordRepository).save(record);
    }
}
