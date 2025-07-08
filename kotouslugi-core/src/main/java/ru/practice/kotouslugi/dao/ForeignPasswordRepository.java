package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.FP.ForeignPassword;

public interface ForeignPasswordRepository extends CrudRepository<ForeignPassword, Long>{

}
