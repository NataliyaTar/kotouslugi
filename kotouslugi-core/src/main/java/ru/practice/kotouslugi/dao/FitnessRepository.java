package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.Fitness;

/**
 * Репозиторий для работы с сущностями Fitness - список фитнес-клубов
 *
 * @author Роман Бурцев
 * @author Свободные места
 */
public interface FitnessRepository extends CrudRepository<Fitness, Long> {
}
