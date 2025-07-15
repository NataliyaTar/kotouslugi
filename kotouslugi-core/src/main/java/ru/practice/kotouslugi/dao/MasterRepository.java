package ru.practice.kotouslugi.dao;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.Master;

import java.util.List;

@Repository
public interface MasterRepository extends CrudRepository<Master,Long>
{
  List<Master> findAll();
}
