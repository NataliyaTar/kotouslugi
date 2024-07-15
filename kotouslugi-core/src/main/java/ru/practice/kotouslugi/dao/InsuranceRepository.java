package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.InsuranceInfo;

public interface InsuranceRepository extends CrudRepository<InsuranceInfo, Integer> {

}
