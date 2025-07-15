package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.practice.kotouslugi.dao.EthicsRecordRepository;
import ru.practice.kotouslugi.model.EthicsRecord;

import java.time.LocalDateTime;

@Service
public class EthicsService {
  private final EthicsRecordRepository recordRepository;

  public EthicsService(EthicsRecordRepository recordRepository) {
    this.recordRepository = recordRepository;
  }

  /**
   * Проверяет, доступно ли время для записи.
   */
  public boolean isTimeSlotAvailable(LocalDateTime startTime) {
    LocalDateTime endTime = startTime.plusHours(1);
    return recordRepository.findOverlappingRecords(startTime, endTime).isEmpty();
  }

  /**
   * Добавляет новую запись, если время свободно.
   */
  @Transactional
  public boolean addEthicsRecord( EthicsRecord ethicsRecord) {
    if (!isTimeSlotAvailable(ethicsRecord.getStartTime())) {
      return false;  // Время занято
    }
    recordRepository.save(ethicsRecord);
    return true;
  }
}
