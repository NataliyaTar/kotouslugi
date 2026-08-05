package ru.practice.kotouslugi.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.GroomingAppointmentStatus;
import ru.practice.kotouslugi.model.enums.GroomingNotificationStatus;
import ru.practice.kotouslugi.model.enums.GroomingNotificationType;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroomingNotificationDto {
    private Long id;
    private Long appointmentId;
    private GroomingNotificationType type;
    private GroomingNotificationStatus status;
    private String message;
    private Date scheduledAt;
    private Date sentAt;
    private LocalDate visitDate;
    private String visitTime;
    private GroomingAppointmentStatus appointmentStatus;
}
