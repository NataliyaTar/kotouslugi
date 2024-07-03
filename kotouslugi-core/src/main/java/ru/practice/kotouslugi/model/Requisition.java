package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "requisition")
public class Requisition implements Serializable {
    @Id
    @GeneratedValue
    private int id;
    private String name;
    private String mnemonic;
    private RequisitionStatus status;
    private Date created;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.ALL})
    @JoinColumn(name = "field")
    private List<Field> fields;
}
