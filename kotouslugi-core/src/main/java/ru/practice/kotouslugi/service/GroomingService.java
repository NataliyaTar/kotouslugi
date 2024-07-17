package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.practice.kotouslugi.dao.GroomingRepository;
import ru.practice.kotouslugi.model.Grooming;

@Service
public class GroomingService {

  private final GroomingRepository groomingRepository;
  private static final Logger logger = LoggerFactory.getLogger(CatService.class);

  public GroomingService(GroomingRepository groomingRepository) {
    this.groomingRepository = groomingRepository;
  }

  public Long addGrooming(Grooming grooming) {
    try {
      grooming = groomingRepository.save(grooming);
      logger.info(String.format("Добавлена запись на груминг = %s ", grooming.getId()));
      return grooming.getId();
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }
}
