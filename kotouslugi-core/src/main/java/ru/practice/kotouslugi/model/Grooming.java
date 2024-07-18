package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "grooming")
@NoArgsConstructor
@AllArgsConstructor
public class Grooming {

    @Id
    @GeneratedValue
    private Long id;

    private String cat;
    private String phoneNumber;
    private String email;
    private String groomer;
    private String date;
    private String time;
}
