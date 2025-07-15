package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.practice.kotouslugi.model.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
