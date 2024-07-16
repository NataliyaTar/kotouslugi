package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.Vaccine;

public interface VaccineRepository extends CrudRepository<Vaccine, Long> {
}
