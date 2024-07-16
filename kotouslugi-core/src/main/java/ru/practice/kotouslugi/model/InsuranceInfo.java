package ru.practice.kotouslugi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "insurance")
public class InsuranceInfo {
  @Id
  @GeneratedValue
  @JsonIgnore
  private int id;
  @Column(name = "insurance_name")
  private String insuranceName;
  private int cash;
}
