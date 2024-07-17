package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.University;

import java.util.List;

public interface UniversityRepository extends CrudRepository<University, Long> {
    List<University> findByUniversityScoreLessThanEqual(Integer score);
}
