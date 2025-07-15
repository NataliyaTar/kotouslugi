package ru.practice.kotouslugi.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.BookingRequest;
import ru.practice.kotouslugi.model.Master;
import ru.practice.kotouslugi.model.TypeService;
import ru.practice.kotouslugi.service.BookingService;
import ru.practice.kotouslugi.service.MasterService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/booking")
public class BookingController
{
  private final BookingService bookingService;
  private final MasterService masterService;
  private final ru.practice.kotouslugi.service.TypeService typeService;

  public BookingController(BookingService bookingService,
                           MasterService masterService,
                           ru.practice.kotouslugi.service.TypeService typeService) {
    this.bookingService = bookingService;
    this.masterService = masterService;
    this.typeService = typeService;
  }

  @GetMapping("/masters")
  public List<Master> getAllMasters() {
    return masterService.getAllMasters();
  }

  @GetMapping("/services")
  public List<TypeService> getAllServices() {
    return typeService.getAllServices();
  }

  @PostMapping
  public ResponseEntity<BookingRequest> createBooking(
    @RequestBody BookingRequest bookingRequest) {


    if (bookingRequest.getStartTime() == null || bookingRequest.getStartTime().isBefore(LocalDateTime.now())) {
      throw new IllegalArgumentException("Некорректное время записи");
    }


    BookingRequest savedBooking = bookingService.saveBooking(bookingRequest);
    return ResponseEntity.ok(savedBooking);
  }
  @GetMapping("/bookings")
  public List<BookingRequest> getAllBookings() {
    return bookingService.getAllBookings();
  }

}
