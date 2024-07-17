package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Builder
@Table(name = "Clubs")
@NoArgsConstructor
@AllArgsConstructor
public class Club {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private Integer number;
    private Date date;
    private String description;
    @Column(name="imgurl")
    private String imgUrl;
}
