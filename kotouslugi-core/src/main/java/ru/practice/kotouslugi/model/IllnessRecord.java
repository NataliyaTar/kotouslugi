package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Date;

@Getter
@Setter
@Entity
@Builder
@Table(name = "illness_record")
@NoArgsConstructor
@AllArgsConstructor
public class IllnessRecord {
    @Id
    @GeneratedValue
    private Long id;
    private Long passportId;
    private String diagnosis;
    private String treatment;
    private Date recordDate;
    private Boolean recovered;
}
