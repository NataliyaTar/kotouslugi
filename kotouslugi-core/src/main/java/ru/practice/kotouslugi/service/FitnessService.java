package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.FitnessRepository;
import ru.practice.kotouslugi.model.Fitness;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
/** Сервис для работы со списком фитнес-клубов
 *
 * @author Роман Бурцев
 * @author Свободные места
 */
public class FitnessService {
    private final FitnessRepository fitnessRepository;
    private static final Logger logger = LoggerFactory.getLogger(FitnessService.class);

    public FitnessService(FitnessRepository fitnessRepository) {
        this.fitnessRepository = fitnessRepository;
    }

    /** Получение списка всех фитнес-клубов
     * @return - список фитнес-клубов
     */
    public List<Fitness> listFitness() {
        List<Fitness> entityList = new LinkedList<>();
        Iterable<Fitness> fitnessEntities = fitnessRepository.findAll();
        fitnessEntities.forEach(entityList::add);
        return entityList;
    }

    /** Получение фитнес-клуба по его id
     *
     * @param id - id фитнес-клуба
     * @return искомый фитнес-клуб
     */
    public Fitness getFitness(Long id) {
        Optional<Fitness> fitness = fitnessRepository.findById(id);
        return fitness.orElse(null);
    }

    /** Добавление фитнес-клуба
     *
     * @param fitness - объект с данными нового фитнес-клуба
     * @return идентификатор созданной записи
     */
    public Long addFitness(Fitness fitness) {
        try {
            fitness = fitnessRepository.save(fitness);
            logger.info(String.format("Добавлен фитнес-клуб №%d = %s ", fitness.getId(), fitness.getFitness_club()));
            return fitness.getId();
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }
    }

    /**
     * Удаление фитнес-клуба по заданному id
     * @param id - идентификатор удаляемого фитнес-клуба
     */
    public void deleteFitness(Long id) {
        Optional<Fitness> fitness = fitnessRepository.findById(id);
        fitness.ifPresent(fitnessRepository::delete);
    }
}
