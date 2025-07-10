package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.FitnessClub;

public interface FitnessClubRepository extends CrudRepository<FitnessClub, Long> {
} 