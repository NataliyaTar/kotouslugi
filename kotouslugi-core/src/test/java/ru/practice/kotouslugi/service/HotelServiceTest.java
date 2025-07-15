package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.HotelRepository;
import ru.practice.kotouslugi.model.Hotel;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class HotelServiceTest {

    private HotelRepository hotelRepository;
    private HotelService hotelService;

    @BeforeEach
    void setUp() {
        hotelRepository = mock(HotelRepository.class);
        hotelService = new HotelService(hotelRepository);
    }

    @Test
    void shouldReturnListOfHotels() {

        List<Hotel> expectedHotels = List.of(
            Hotel.builder()
                .id(1L)
                .name("Cat Palace")
                .address("Улица Пушкина")
                .build()
        );

        when(hotelRepository.findAll()).thenReturn(expectedHotels);


        List<Hotel> actualHotels = hotelService.listHotels();


        assertThat(actualHotels).isEqualTo(expectedHotels);
        verify(hotelRepository).findAll();
    }
}
