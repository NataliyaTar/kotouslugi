package ru.practice.kotouslugi.model;

import lombok.*;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "exam")
public class Exam {
    @Id
    private Long examId;
    private String subjectName;
    private Integer score;
    private Long idCat;
}
