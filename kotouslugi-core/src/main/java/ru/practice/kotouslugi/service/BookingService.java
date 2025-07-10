package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.BookingRequestRepository;
import ru.practice.kotouslugi.model.BookingRequest;

import java.util.List;

@Service
public class BookingService
{
  private final BookingRequestRepository bookingRequestRepository;

  public BookingService(BookingRequestRepository bookingRequestRepository) {
    this.bookingRequestRepository = bookingRequestRepository;
  }

  public List<BookingRequest> getAllBookings() {
    return bookingRequestRepository.findAll();
  }
  public BookingRequest saveBooking(BookingRequest bookingRequest) {
    if (bookingRequestRepository.isTimeBooked(bookingRequest.getStart_time(), (long) bookingRequest.getWorker_id())) {
      throw new RuntimeException("Время уже занято");
    }
    return bookingRequestRepository.save(bookingRequest);
  }

}
