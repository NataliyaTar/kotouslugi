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
@Table(name = "counterfeit_report")
@NoArgsConstructor
@AllArgsConstructor
public class CounterfeitReport {
    @Id
    @GeneratedValue
    private Long id;
    private String batchCode;
    private String description;
    private String reporterContact;
    private Date created;
    private String status;
}
