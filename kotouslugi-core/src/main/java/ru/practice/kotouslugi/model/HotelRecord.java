package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@Table(name = "Hotel_records")
@NoArgsConstructor
@AllArgsConstructor
public class HotelRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_record")
    private Long idRecord;

    @Column(name = "Id_cat")
    private Long idCat;

    @Column(name = "Id_hotel")
    private Long idHotel;

    @Column(name = "Record_start")
    private LocalDateTime recordStart;

    @Column(name = "Record_finish")
    private LocalDateTime recordFinish;

    @Column(name = "Record_stat")
    private String recordStat;
}
