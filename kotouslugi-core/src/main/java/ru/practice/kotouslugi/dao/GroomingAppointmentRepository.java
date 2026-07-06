package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.GroomingAppointment;

import java.time.LocalDate;
import java.util.List;

public interface GroomingAppointmentRepository extends CrudRepository<GroomingAppointment, Long> {
    List<GroomingAppointment> findBySalonIdAndVisitDate(Long salonId, LocalDate visitDate);
    List<GroomingAppointment> findByCatId(Long catId);
    List<GroomingAppointment> findAll();
}
