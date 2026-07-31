package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Requisition;

import java.util.List;
import java.util.Optional;

public interface RequisitionRepository extends CrudRepository<Requisition, Integer> {
    List<Requisition> findAll();
}
