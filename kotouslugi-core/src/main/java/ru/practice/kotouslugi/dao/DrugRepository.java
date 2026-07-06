package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Drug;

public interface DrugRepository extends CrudRepository<Drug, Long> {
}
