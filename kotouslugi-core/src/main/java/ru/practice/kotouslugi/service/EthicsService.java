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

  public boolean isTimeSlotAvailable(LocalDateTime startTime) {
    LocalDateTime endTime = startTime.plusHours(1);
    return recordRepository.findOverlappingRecords(startTime, endTime).isEmpty();
  }

  @Transactional
  public boolean addEthicsRecord(
    String catName,
    LocalDateTime startTime,
    String courseType,
    String teacherName,
    String teacherAbout,
    String ownerName,
    String phoneNumber,
    String email
  ) {
    if (!isTimeSlotAvailable(startTime)) {
      return false;  // Время занято
    }

    EthicsRecord record = new EthicsRecord();
    record.setCatName(catName);
    record.setStartTime(startTime);
    record.setCourseType(courseType);
    record.setTeacherName(teacherName);
    record.setTeacherAbout(teacherAbout);
    record.setOwnerName(ownerName);
    record.setPhoneNumber(phoneNumber);
    record.setEmail(email);

    recordRepository.save(record);
    return true;
  }
}
