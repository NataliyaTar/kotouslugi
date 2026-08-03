package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "missing_cat")
public class MissingCatRequisition {
  @Id
  @GeneratedValue
  private Integer id;
  private String catName;
  private String breed;
  private String color;
  private Integer age;
  private String gender;
  @Column(length = 1000)
  private String distinctiveFeatures;
  private String lastSeenDate;
  @Column(length = 500)
  private String lastSeenPlace;
  @Column(length = 500)
  private String mapLocation;
  private String phone;
  @Column(length = 1000)
  private String additionalInfo;
  private String status;
  private Date created;
  private String photoNames;
  private String documentNames;
}
