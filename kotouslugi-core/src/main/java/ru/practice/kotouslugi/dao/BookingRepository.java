package ru.practice.kotouslugi.dao;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends CrudRepository<ru.practice.kotouslugi.model.BookingRequest, Long>
{
  List<ru.practice.kotouslugi.model.BookingRequest> findAll();
  ru.practice.kotouslugi.model.BookingRequest save(ru.practice.kotouslugi.model.BookingRequest bookingRequest);
  @Query("SELECT COUNT(b) > 0 FROM BookingRequest b WHERE b.startTime = :time AND b.workerId = :workerId")
  boolean isTimeBooked(@Param("time") LocalDateTime time, @Param("workerId") Long workerId);

}

