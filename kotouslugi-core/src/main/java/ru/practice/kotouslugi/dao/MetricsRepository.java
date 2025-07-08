package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Metrics;

public interface MetricsRepository extends CrudRepository<Metrics, Long> {
}
