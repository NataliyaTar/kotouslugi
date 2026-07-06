package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Vaccination;

import java.util.List;

public interface VaccinationRepository extends CrudRepository<Vaccination, Long> {
    List<Vaccination> findByPassportId(Long passportId);
}
