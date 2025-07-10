package ru.practice.kotouslugi.dao;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.Master;
import ru.practice.kotouslugi.model.Type_service;

import java.util.List;

@Repository
public interface TypeServiceRepository extends CrudRepository<Type_service,Long>
{
  List<Type_service> findAll();
}
