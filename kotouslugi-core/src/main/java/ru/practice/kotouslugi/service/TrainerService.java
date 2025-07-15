package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.TrainerRepository;
import ru.practice.kotouslugi.model.Trainer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.practice.kotouslugi.model.enums.MembershipType;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
/** Сервис для работы со списком тренеров фитнес-клубов
 *
 * @author Роман Бурцев
 * @author Свободные места
 */
public class TrainerService {
    private final TrainerRepository trainerRepository;
    private static final Logger logger = LoggerFactory.getLogger(TrainerService.class);

    public TrainerService(TrainerRepository trainerRepository) { this.trainerRepository = trainerRepository; }

    /** Получение списка всех тренеров фитнес-клубов
     * @return - список фитнес-клубов
     */
    public List<Trainer> listTrainers() {
        List<Trainer> entityList = new LinkedList<>();
        Iterable<Trainer> trainerEntities = trainerRepository.findAll();
        trainerEntities.forEach(entityList::add);
        return entityList;
    }

  /** Получение списка тренеров по ID фитнес-клуба
   * @param id - идентификатор фитнес-клуба
   * @return - список фитнес-клубов
   */
    public List<Trainer> listTrainersByFitnessClubId(Long id) {
        List<Trainer> entityList = new LinkedList<>();
        Iterable<Trainer> trainerEntities = trainerRepository.getByFitnessClubId(id);
        trainerEntities.forEach(entityList::add);
        return entityList;
    }

  /** Получение списка тренеров по ID фитнес-клуба и типу абонемента
   * @param id - идентификатор фитнес-клуба
   * @return - список фитнес-клубов
   */
  public List<Trainer> listTrainersByFClubIdAndMType(Long id, MembershipType mType) {
    List<Trainer> entityList = new LinkedList<>();
    Iterable<Trainer> trainerEntities = trainerRepository.getByFitnessClubIdAndMembershipType(id, mType);
    trainerEntities.forEach(entityList::add);
    return entityList;
  }

  /** Получение тренера по его id
   *
   * @param id - id тренера
   * @return искомый тренер
   */
    public Trainer getTrainer(Long id) {
        Optional<Trainer> trainer = trainerRepository.findById(id);
        return trainer.orElse(null);
    }

    /** Добавление тренера
     *
     * @param trainer - объект с данными нового тренера
     * @return идентификатор созданной записи
     */
    public Long addTrainer(Trainer trainer) {
        try {
            trainer = trainerRepository.save(trainer);
            logger.info(String.format("Добавлен тренер №%d = %s ", trainer.getId(), trainer.getTrainers_name()));
            return trainer.getId();
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }
    }

    /**
     * Удаление тренера по заданному id
     * @param id - идентификатор удаляемого тренера
     */
    public void deleteTrainer(Long id) {
        Optional<Trainer> fitness = trainerRepository.findById(id);
        fitness.ifPresent(trainerRepository::delete);
    }
}
