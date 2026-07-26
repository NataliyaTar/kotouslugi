package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.DrivingSchool;

public interface DrivingSchoolRepository extends CrudRepository<DrivingSchool, Integer> {
    @Query("from DrivingSchool ds where ds.name = :name")
    DrivingSchool findByName(@Param("name") String name);
}
