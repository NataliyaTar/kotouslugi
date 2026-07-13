package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Requisition;

public interface RequisitionRepository extends JpaRepository<Requisition, Integer> {

}
