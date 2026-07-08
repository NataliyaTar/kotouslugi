package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.FineStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;

@Getter
@Setter
@Entity
@Builder
@Table(name = "fine")
@NoArgsConstructor
@AllArgsConstructor
public class Fine {
    @Id
    @GeneratedValue
    private Long id;
    private Long catId;      // id кота, к которому относится штраф
    private String reason;   // причина штрафа
    private Integer amount;  // сумма в рублях
    @Enumerated(EnumType.STRING)
    private FineStatus status;
    private Date created;    // дата начисления
}
