package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.EthicsRecord;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EthicsRecordRepository extends JpaRepository<EthicsRecord, Long> {
  @Query("""
  SELECT e FROM EthicsRecord e
  WHERE e.startTime < :endTime AND
        e.startTime >= :startTime
""")
  List<EthicsRecord> findOverlappingRecords(
    @Param("startTime") LocalDateTime windowStart,
    @Param("endTime") LocalDateTime windowEnd
  );
}
