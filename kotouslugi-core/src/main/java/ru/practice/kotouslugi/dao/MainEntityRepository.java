package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.MainEntity;

public interface MainEntityRepository extends CrudRepository<MainEntity, Long> {

}
