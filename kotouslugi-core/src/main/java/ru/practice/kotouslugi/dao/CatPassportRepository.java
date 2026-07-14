package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.PassportDetail;

import java.util.Optional;

public interface CatPassportRepository extends CrudRepository<PassportDetail, Long> {
  Optional<PassportDetail> findByPassportNumber(String passportNumber);
  boolean existsByPassportNumber(String passportNumber);
}
