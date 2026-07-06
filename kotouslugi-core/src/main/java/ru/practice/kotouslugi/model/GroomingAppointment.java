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
import ru.practice.kotouslugi.model.enums.GroomingAppointmentStatus;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "grooming_appointment")
public class GroomingAppointment {
    @Id
    @GeneratedValue
    private Long id;
    private Integer requisitionId;
    private Long catId;
    private Long salonId;
    private Long groomerId;
    private String packageType;
    private String ownerContact;
    private String notes;
    private LocalDate visitDate;
    private String visitTime;
    @Enumerated(EnumType.STRING)
    private GroomingAppointmentStatus status;
    private String salonResponse;
    private Date created;
}
