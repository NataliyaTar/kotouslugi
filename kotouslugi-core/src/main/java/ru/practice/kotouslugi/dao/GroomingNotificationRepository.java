package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.GroomingNotification;

import java.util.List;

public interface GroomingNotificationRepository extends CrudRepository<GroomingNotification, Long> {
    List<GroomingNotification> findByAppointmentId(Long appointmentId);
    List<GroomingNotification> findByAppointmentIdIn(List<Long> appointmentIds);
}
