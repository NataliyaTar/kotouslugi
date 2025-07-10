package ru.practice.kotouslugi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "membership")
public class Membership {
    @Id
    @GeneratedValue
    private Long id;

    /** Длительность абонемента в месяцах (1, 6, 12) */
    private int durationMonths;

    /** Цена абонемента */
    private float price;

    /** Клуб, к которому относится абонемент */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fitness_club_id")
    @JsonBackReference
    private FitnessClub fitnessClub;
} 