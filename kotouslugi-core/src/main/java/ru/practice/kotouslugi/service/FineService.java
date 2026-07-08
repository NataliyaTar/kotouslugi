package ru.practice.kotouslugi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.FineRepository;
import ru.practice.kotouslugi.model.Fine;
import ru.practice.kotouslugi.model.enums.FineStatus;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class FineService {
    private final FineRepository fineRepository;
    private static final Logger logger = LoggerFactory.getLogger(FineService.class);

    public FineService(FineRepository fineRepository) {
      this.fineRepository = fineRepository;
    }

    public List<Fine> listFines() {
        List<Fine> list = new LinkedList<>();
        Iterable<Fine> all = fineRepository.findAll();
        all.forEach(list::add);
        return list;
    }

    public List<Fine> listFinesByCat(Long catId) {
        return fineRepository.findByCatId(catId);
    }

    public Fine getFine(Long id) {
        Optional<Fine> fine = fineRepository.findById(id);
        return fine.orElse(null);
    }

    public Long addFine(Fine fine) {
        try {
            fine.setStatus(FineStatus.UNPAID);
            fine.setCreated(new Date());
            fine = fineRepository.save(fine);
            logger.info(String.format("Добавлен штраф = %s ", fine.getReason()));
            return fine.getId();
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }
    }

    // "Оплата" штрафа: находим по id, ставим статус PAID, сохраняем
    public Fine payFine(Long id) {
        Optional<Fine> found = fineRepository.findById(id);
        if (found.isEmpty()) {
            return null;
        }
        Fine fine = found.get();
        fine.setStatus(FineStatus.PAID);
        return fineRepository.save(fine);
    }
}
