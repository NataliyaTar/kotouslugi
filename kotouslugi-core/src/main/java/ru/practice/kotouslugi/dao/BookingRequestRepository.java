package ru.practice.kotouslugi.dao;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.BookingRequest;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRequestRepository extends CrudRepository<BookingRequest, Long>
{
  List<BookingRequest> findAll();
  BookingRequest save(BookingRequest bookingRequest);
  @Query("SELECT COUNT(b) > 0 FROM BookingRequest b WHERE b.start_time = :time AND b.worker_id = :workerId")
  boolean isTimeBooked(@Param("time") LocalDateTime time, @Param("workerId") Long workerId);

}

