package ru.practice.kotouslugi.dao;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.TypeService;

import java.util.List;

@Repository
public interface TypeServiceRepository extends CrudRepository<TypeService,Long>
{
  List<TypeService> findAll();
}
