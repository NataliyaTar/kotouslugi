package ru.practice.kotouslugi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

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
    private String imgurl;

}
