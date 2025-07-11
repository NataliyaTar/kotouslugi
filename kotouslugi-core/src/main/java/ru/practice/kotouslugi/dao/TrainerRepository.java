package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.Trainer;

/**
 * Репозиторий для работы с сущностями Trainer - список тренеров фитнес-клубов
 *
 * @author Роман Бурцев
 * @author Свободные места
 */
public interface TrainerRepository extends CrudRepository<Trainer, Long> {
    @Query("FROM Trainer t WHERE t.fitness_club.id = :fitness_club_id")
    /**
     * Получение списка тренеров данного фитнес-клуба
     * @param fitness_club_id - уникальный идентификатор фитнес-клуба
     * @return списсок тренеров заданного фитнес-клуба
     */
    Iterable<Trainer> getByFitnessClubId(@Param("fitness_club_id")  Long fitness_club_id);
}
