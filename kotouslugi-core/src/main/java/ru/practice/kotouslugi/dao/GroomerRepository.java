package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Groomer;

import java.util.List;

public interface GroomerRepository extends CrudRepository<Groomer, Long> {
    List<Groomer> findBySalonId(Long salonId);
}
