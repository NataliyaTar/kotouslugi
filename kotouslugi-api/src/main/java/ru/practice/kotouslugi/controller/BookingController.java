package ru.practice.kotouslugi.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.BookingRequest;
import ru.practice.kotouslugi.model.Master;
import ru.practice.kotouslugi.model.Type_service;
import ru.practice.kotouslugi.service.BookingService;
import ru.practice.kotouslugi.service.MasterService;
import ru.practice.kotouslugi.service.TypeServiceService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/booking")
public class BookingController
{
  private final BookingService bookingService;
  private final MasterService masterService;
  private final TypeServiceService typeServiceService;

  public BookingController(BookingService bookingService,
                           MasterService masterService,
                           TypeServiceService typeServiceService) {
    this.bookingService = bookingService;
    this.masterService = masterService;
    this.typeServiceService = typeServiceService;
  }

  @GetMapping("/masters")
  public List<Master> getAllMasters() {
    return masterService.getAllMasters();
  }

  @GetMapping("/services")
  public List<Type_service> getAllServices() {
    return typeServiceService.getAllServices();
  }

  @PostMapping
  public ResponseEntity<BookingRequest> createBooking(
    @RequestBody BookingRequest bookingRequest) {


    if (bookingRequest.getStart_time() == null || bookingRequest.getStart_time().isBefore(LocalDateTime.now())) {
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
