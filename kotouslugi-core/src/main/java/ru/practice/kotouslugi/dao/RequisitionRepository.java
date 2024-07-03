package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Requisition;

public interface RequisitionRepository extends CrudRepository<Requisition, Integer> {

}
