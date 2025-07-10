package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.EthicsRecord;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EthicsRecordRepository extends JpaRepository<EthicsRecord, Long> {

  // Проверка, есть ли запись на указанное время
  @Query("SELECT e FROM EthicsRecord e WHERE e.dateTime = :dateTime")
  Optional<EthicsRecord> findByDateTime(@Param("dateTime") LocalDateTime dateTime);

}
