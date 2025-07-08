package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.StatementForPassport;

public interface StatementForPassportRepository extends CrudRepository<StatementForPassport, Long> {
}
