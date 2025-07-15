package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.BookingRepository;
import ru.practice.kotouslugi.model.BookingRequest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class BookingServiceTest {
    private BookingRepository bookingRepository;
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        bookingRepository = mock(BookingRepository.class);
        bookingService = new BookingService(bookingRepository);
    }

    @Test
    void shouldReturnBookingList() {
        when(bookingRepository.findAll()).thenReturn(getBookingList());
        bookingService.getAllBookings();
        verify(bookingRepository).findAll();
    }

    @Test
    void shouldSaveBookingIfTimeNotBooked() {
        BookingRequest booking = getBooking();
        when(bookingRepository.isTimeBooked(booking.getStartTime(), booking.getWorkerId())).thenReturn(false);
        when(bookingRepository.save(booking)).thenReturn(booking);
        bookingService.saveBooking(booking);
        verify(bookingRepository).save(booking);
    }

    @Test
    void shouldThrowIfTimeBooked() {
        BookingRequest booking = getBooking();
        when(bookingRepository.isTimeBooked(booking.getStartTime(), booking.getWorkerId())).thenReturn(true);
        assertThrows(RuntimeException.class, () -> bookingService.saveBooking(booking));
    }

    private List<BookingRequest> getBookingList() {
        return List.of(getBooking());
    }

    private BookingRequest getBooking() {
        return BookingRequest.builder()
                .id(1L)
                .catId(2)
                .contactEmail("test@mail.com")
                .contactNumber("12345678901")
                .workerId(3L)
                .startTime(LocalDateTime.now().plusDays(1))
                .idTypeService(4)
                .build();
    }
} 