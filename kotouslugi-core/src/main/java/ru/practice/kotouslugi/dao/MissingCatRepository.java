package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.MissingCatRequisition;

public interface MissingCatRepository extends CrudRepository<MissingCatRequisition, Integer> {
}
