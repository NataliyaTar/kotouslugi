package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.DriverLicense;

import java.time.LocalDate;
import java.time.LocalTime;

public interface DriverLicenseRepository extends CrudRepository<DriverLicense, Integer> {
    @Query("select count(dl) from DriverLicense dl where dl.drivingSchool = :school and dl.examDate = :date and dl.examTime = :time")
    long countBySlot(@Param("school") String school, @Param("date") LocalDate date, @Param("time") LocalTime time);
}
