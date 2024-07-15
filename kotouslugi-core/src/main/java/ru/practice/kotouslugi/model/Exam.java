package ru.practice.kotouslugi.model;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "exam")
public class Exam {
  @Id
  private Long examId;
  private String subjectName;
  private Integer score;
  private Long idCat;
}
