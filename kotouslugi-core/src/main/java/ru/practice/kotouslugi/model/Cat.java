package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.Sex;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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
}
