package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.BookingRepository;

import java.util.List;

@Service
public class BookingService
{
  private final BookingRepository bookingRepositoryRepository;

  public BookingService(BookingRepository bookingRepositoryRepository) {
    this.bookingRepositoryRepository = bookingRepositoryRepository;
  }

  public List<ru.practice.kotouslugi.model.BookingRequest> getAllBookings() {
    return bookingRepositoryRepository.findAll();
  }
  public ru.practice.kotouslugi.model.BookingRequest saveBooking(ru.practice.kotouslugi.model.BookingRequest bookingRequest) {
    Long workerId = bookingRequest.getWorkerId();
    if (bookingRepositoryRepository.isTimeBooked(bookingRequest.getStartTime(), workerId)) {
      throw new RuntimeException("Время уже занято");
    }
    return bookingRepositoryRepository.save(bookingRequest);
  }

}
