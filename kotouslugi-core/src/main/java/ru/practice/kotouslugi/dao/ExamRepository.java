package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Exam;

import java.util.List;

public interface ExamRepository extends CrudRepository<Exam, Long> {
    List<Exam> findByIdCat(Long idCat);
}
