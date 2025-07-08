package ru.practice.kotouslugi.model.FP;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor // Добавляет пустой конструктор
@AllArgsConstructor // Добавляет конструктор со всеми полями
@Embeddable
public class PersonalData implements Serializable {
  ///PersonalData это компонент ForeingPassword, который содержит данные из формы заполненной пользователем.///
  private String name;
  private String firstName;
  private String fathName;
  private String sex;
  private LocalDate dateOfBirth;
  private String placeBorn;
  private String regAddress;
  private Boolean children;
}
