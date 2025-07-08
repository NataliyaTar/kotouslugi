package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.model.HotelRecord;
import ru.practice.kotouslugi.dao.HotelRecordRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HotelRecordService {

  private final HotelRecordRepository hotelRecordRepository;

  public HotelRecordService(HotelRecordRepository hotelRecordRepository) {
    this.hotelRecordRepository = hotelRecordRepository;
  }

  public boolean checkSpace(Long hotelId, LocalDateTime start, LocalDateTime finish) {
    List<HotelRecord> overlappingRecords = hotelRecordRepository
      .findByHotelIdAndRecordFinishAfterAndRecordStartBefore(hotelId, start, finish);
    return overlappingRecords.isEmpty();
  }

  public HotelRecord saveRecord(HotelRecord record) {
    // Можно здесь сделать проверки валидации и прочее
    record.setRecordStatus("ACTIVE"); // например, статус по умолчанию
    return hotelRecordRepository.save(record);
  }
}
