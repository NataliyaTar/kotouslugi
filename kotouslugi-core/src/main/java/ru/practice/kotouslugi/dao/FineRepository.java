package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Fine;

import java.util.List;

public interface FineRepository extends CrudRepository<Fine, Long> {

    List<Fine> findByCatId(Long catId);
}
