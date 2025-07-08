package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.HotelRepository;
import ru.practice.kotouslugi.model.Hotel;

import java.util.List;

@Service
public class HotelService {
  private final HotelRepository hotelRepository;

  public HotelService(HotelRepository hotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  public List<Hotel> listHotels() {
    return hotelRepository.findAll();
  }
}
