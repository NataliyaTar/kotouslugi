package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "Clubs")
@NoArgsConstructor
@AllArgsConstructor
public class Club {
    @Id
    @GeneratedValue
    private Long id;
    private String NAME;
    private Integer NUMBER;
    private Date DATE;
    private String description;
    @Column(name="imgurl")
    private String imgUrl;
}
