package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Builder
@Table(name = "cat")
@NoArgsConstructor
@AllArgsConstructor
public class Cat {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String age;
    private String sex;
    private String breed;
   @Column(nullable = false)
   private String politicalStatus = "NONE";
   private Date lastVoteDate;
}
