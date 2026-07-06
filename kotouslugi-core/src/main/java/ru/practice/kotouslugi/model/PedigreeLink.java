package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.RelationType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@Builder
@Table(name = "pedigree_link")
@NoArgsConstructor
@AllArgsConstructor
public class PedigreeLink {
    @Id
    @GeneratedValue
    private Long id;
    private Long passportId;
    private Long relativePassportId;
    @Enumerated(EnumType.STRING)
    private RelationType relationType;
}
