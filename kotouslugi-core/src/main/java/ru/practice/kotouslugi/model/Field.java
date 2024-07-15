package ru.practice.kotouslugi.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Field implements Serializable {
    @Id
    @GeneratedValue
    private int id;
    private String name;
    private String value;
}
