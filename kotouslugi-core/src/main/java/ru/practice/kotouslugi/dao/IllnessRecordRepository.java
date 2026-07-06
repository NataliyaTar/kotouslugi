package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.IllnessRecord;

import java.util.List;

public interface IllnessRecordRepository extends CrudRepository<IllnessRecord, Long> {
    List<IllnessRecord> findByPassportId(Long passportId);
}
