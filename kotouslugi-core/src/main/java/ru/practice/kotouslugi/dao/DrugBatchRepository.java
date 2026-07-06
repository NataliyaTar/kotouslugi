package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.DrugBatch;

import java.util.Optional;

public interface DrugBatchRepository extends CrudRepository<DrugBatch, Long> {
    Optional<DrugBatch> findByBatchCode(String batchCode);
}
