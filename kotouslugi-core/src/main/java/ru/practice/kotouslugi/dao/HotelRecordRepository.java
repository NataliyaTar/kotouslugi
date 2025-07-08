package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.HotelRecord;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HotelRecordRepository extends JpaRepository<HotelRecord, Long> {
  // Проверка свободного времени — ищем записи с пересечением дат
  List<HotelRecord> findByHotelIdAndRecordFinishAfterAndRecordStartBefore(
    Long hotelId, LocalDateTime start, LocalDateTime finish);
}
