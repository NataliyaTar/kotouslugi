package ru.practice.kotouslugi.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
public class Field implements Serializable {
    @Id
    @GeneratedValue
    private int id;
    private String name;
    private String value;
}
