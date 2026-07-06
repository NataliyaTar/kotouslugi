package ru.practice.kotouslugi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.GroomingNotificationStatus;
import ru.practice.kotouslugi.model.enums.GroomingNotificationType;

import java.util.Date;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "grooming_notification")
public class GroomingNotification {
    @Id
    @GeneratedValue
    private Long id;
    private Long appointmentId;
    @Enumerated(EnumType.STRING)
    private GroomingNotificationType type;
    @Enumerated(EnumType.STRING)
    private GroomingNotificationStatus status;
    private String message;
    private Date scheduledAt;
    private Date sentAt;
}
