package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.MasterRepository;
import ru.practice.kotouslugi.model.Master;

import java.util.List;


@Service
public class MasterService {
  private final MasterRepository masterRepository;

  public MasterService(MasterRepository masterRepository) {
    this.masterRepository = masterRepository;
  }

  public List<Master> getAllMasters() {
    return masterRepository.findAll();
  }
}
