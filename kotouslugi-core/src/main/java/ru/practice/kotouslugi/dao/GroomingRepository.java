package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Grooming;

public interface GroomingRepository extends CrudRepository<Grooming, Long> {
}
