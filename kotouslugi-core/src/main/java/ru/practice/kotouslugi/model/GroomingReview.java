package ru.practice.kotouslugi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "grooming_review")
public class GroomingReview {
    @Id
    @GeneratedValue
    private Long id;
    private Long appointmentId;
    private Long salonId;
    private Long catId;
    private Integer rating;
    private String comment;
    private Boolean forwardedToSalon;
    private Date created;
}
