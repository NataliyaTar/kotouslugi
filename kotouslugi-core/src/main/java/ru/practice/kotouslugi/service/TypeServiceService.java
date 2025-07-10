package ru.practice.kotouslugi.service;


import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.TypeServiceRepository;
import ru.practice.kotouslugi.model.Type_service;

import java.util.List;
@Service
public class TypeServiceService
{
  private final TypeServiceRepository typeServiceRepo;

  public TypeServiceService(TypeServiceRepository typeServiceRepo) {
    this.typeServiceRepo = typeServiceRepo;
  }

  public List<Type_service> getAllServices() {
    return typeServiceRepo.findAll();
  }

}
