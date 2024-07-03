package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Cat;

public interface CatRepository extends CrudRepository<Cat, Long> {

}
