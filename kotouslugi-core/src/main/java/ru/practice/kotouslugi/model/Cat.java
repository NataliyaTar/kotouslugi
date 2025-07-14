package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Builder
@Table(name = "cat")
@NoArgsConstructor
@AllArgsConstructor
public class Cat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cat_id")
    private Long catId;

    @Column(name = "cat_name", nullable = false, length = 100)
    private String catName;

    @Column(name = "breed", nullable = false, length = 30)
    private String breed;

    @Enumerated(EnumType.STRING)
    @Column(name = "cat_gender", nullable = false)
    private CatGender catGender;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "owner_phone", nullable = false, length = 20)
    private String ownerPhone;

    public enum CatGender {
        кошка, кот
    }
}
