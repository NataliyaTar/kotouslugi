package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "banner")
public class Banner {
    @Id
    @GeneratedValue
    private Long id;
    private String bg;
    private String title;
    private String text;
    @Column(name="imgurl")
    private String imgUrl;

}
