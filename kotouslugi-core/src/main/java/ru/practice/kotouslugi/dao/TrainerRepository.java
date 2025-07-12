package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.Trainer;
import ru.practice.kotouslugi.model.enums.MembershipType;

/**
 * Репозиторий для работы с сущностями Trainer - список тренеров фитнес-клубов
 *
 * @author Роман Бурцев
 * @author Свободные места
 */
public interface TrainerRepository extends CrudRepository<Trainer, Long> {
  /**
   * Получение списка тренеров данного фитнес-клуба
   *
   * @param fitness_club_id - уникальный идентификатор фитнес-клуба
   * @return список тренеров заданного фитнес-клуба
   */
  @Query("FROM Trainer t WHERE t.fitness_club.id = :fitness_club_id")
  Iterable<Trainer> getByFitnessClubId(@Param("fitness_club_id") Long fitness_club_id);

  /**
   * Получить всех тренеров для заданного клуба и заданного вида занятий
   *
   * @param fitness_club_id - уникальный идентификатор фитнес-клуба
   * @param membership_type - вид абонемента
   * @return список тренеров заданного фитнес-клуба
   */
  @Query("FROM Trainer t WHERE t.fitness_club.id = :fitness_club_id AND t.membership_type = :membership_type")
  Iterable<Trainer> getByFitnessClubIdAndMembershipType(
    @Param("fitness_club_id") Long fitness_club_id,
    @Param("membership_type") MembershipType membership_type
  );
}
