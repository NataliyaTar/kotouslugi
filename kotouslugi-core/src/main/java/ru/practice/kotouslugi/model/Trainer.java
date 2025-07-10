package ru.practice.kotouslugi.model;

import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import ru.practice.kotouslugi.model.Fitness;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fitness_trainers")
/**
 * Сущность для хранения перечня тренеров в фитнес-клубах
 *
 * @author Роман Бурцев
 * @author Свободные места
 */
public class Trainer {
    @Id
    @GeneratedValue
    /**
     * Уникальный идентификатор тренера
     */
    private Long id;

    /** Имя тренера */
    private String trainers_name;

    /** Фитнес-клуб, к которому относится тренер */
    @ManyToOne
    @JoinColumn(name = "fitness_club_id")
    @JsonIgnore
    private Fitness fitness_club;

    @Column(name = "fitness_club_id")
    @JsonGetter("fitness_club_id")
    public Long getFitnessClubId() {
        return fitness_club.getId();
    }

    /*
        Если не ввести новое поле @JsonGetter и не игнорировать @JsonIgnore fitness_club,
        при запросе к API сервер выдаст для каждого тренера ОБЪЕКТ его фитнес-клуба

        А хватит только id клуба. Наверное...
    */
}
