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
    private Fitness fitness_club;
}
