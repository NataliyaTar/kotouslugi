package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.ExamRepository;
import ru.practice.kotouslugi.model.Exam;

import java.util.List;

@Service
public class ExamService {
    private final ExamRepository examRepository;

    public ExamService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    public List<Exam> findExamsByCatId(Long idCat) {
        return examRepository.findByIdCat(idCat);
    }
}
