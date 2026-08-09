package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Appointment;

public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {
}
