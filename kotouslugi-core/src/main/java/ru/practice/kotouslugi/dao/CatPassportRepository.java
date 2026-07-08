package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.PassportDetail;

public interface CatPassportRepository extends CrudRepository<PassportDetail, Long> {

}
