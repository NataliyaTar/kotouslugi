package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.UniversityRepository;
import ru.practice.kotouslugi.model.University;

import java.util.List;

@Service
public class UniversityService {
    private final UniversityRepository universityRepository;

    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    public List<University> findUniversitiesByScore(Integer score) {
        return universityRepository.findByUniversityScoreLessThanEqual(score);
    }
}
