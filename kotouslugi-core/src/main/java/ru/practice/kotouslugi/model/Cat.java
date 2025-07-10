package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;

@Getter
@Setter
@Entity
@Builder
@Table(name = "cat")
@NoArgsConstructor
@AllArgsConstructor
public class Cat {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String age;
    private String sex;
    private String breed;

    /** Клуб, в котором работает кот-тренер */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fitness_club_id")
    @JsonBackReference
    private FitnessClub fitnessClub;
}
