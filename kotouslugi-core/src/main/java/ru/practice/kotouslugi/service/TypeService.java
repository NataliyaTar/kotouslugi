package ru.practice.kotouslugi.service;


import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.TypeServiceRepository;

import java.util.List;
@Service
public class TypeService
{
  private final TypeServiceRepository typeServiceRepo;

  public TypeService(TypeServiceRepository typeServiceRepo) {
    this.typeServiceRepo = typeServiceRepo;
  }

  public List<ru.practice.kotouslugi.model.TypeService> getAllServices() {
    return typeServiceRepo.findAll();
  }

}
