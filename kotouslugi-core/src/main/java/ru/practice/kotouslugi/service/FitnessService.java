package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.FitnessClubRepository;
import ru.practice.kotouslugi.model.FitnessClub;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class FitnessService {
    private final FitnessClubRepository fitnessClubRepository;
    private static final Logger logger = LoggerFactory.getLogger(FitnessService.class);

    public FitnessService(FitnessClubRepository fitnessClubRepository) {
        this.fitnessClubRepository = fitnessClubRepository;
    }

    /** Получение списка всех фитнес-клубов с абонементами, тренерами и типами тренировок */
    public List<FitnessClub> listFitnessClubs() {
        List<FitnessClub> entityList = new LinkedList<>();
        Iterable<FitnessClub> clubs = fitnessClubRepository.findAll();
        clubs.forEach(entityList::add);
        return entityList;
    }

    /** Получение фитнес-клуба по его id */
    public FitnessClub getFitnessClub(Long id) {
        Optional<FitnessClub> club = fitnessClubRepository.findById(id);
        return club.orElse(null);
    }

    /** Добавление фитнес-клуба */
    public Long addFitnessClub(FitnessClub club) {
        try {
            club = fitnessClubRepository.save(club);
            logger.info(String.format("Добавлен фитнес-клуб №%d = %s ", club.getId(), club.getName()));
            return club.getId();
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }
    }

    public void deleteFitnessClub(Long id) {
        Optional<FitnessClub> club = fitnessClubRepository.findById(id);
        club.ifPresent(fitnessClubRepository::delete);
    }
}
