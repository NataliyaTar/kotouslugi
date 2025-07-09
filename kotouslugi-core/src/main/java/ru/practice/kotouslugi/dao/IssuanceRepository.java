package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Issuance;

public interface IssuanceRepository extends CrudRepository<Issuance, Long> {
}
