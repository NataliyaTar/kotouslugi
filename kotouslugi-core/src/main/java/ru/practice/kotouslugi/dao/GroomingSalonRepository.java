package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.GroomingSalon;

import java.util.List;

public interface GroomingSalonRepository extends CrudRepository<GroomingSalon, Long> {
    List<GroomingSalon> findAll();
}
