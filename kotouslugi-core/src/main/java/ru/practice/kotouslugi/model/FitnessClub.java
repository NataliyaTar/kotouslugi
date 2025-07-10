package ru.practice.kotouslugi.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import ru.practice.kotouslugi.model.enums.TrainingType;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fitness_club")
public class FitnessClub {
    @Id
    @GeneratedValue
    private Long id;

    /** Название фитнес-клуба */
    private String name;

    /** Типы тренировок, доступные в клубе */
    @ElementCollection(targetClass = TrainingType.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "fitness_club_training_types", joinColumns = @JoinColumn(name = "fitness_club_id"))
    @Column(name = "training_type")
    private Set<TrainingType> trainingTypes;

    /** Абонементы клуба */
    @OneToMany(mappedBy = "fitnessClub", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Membership> memberships;

    /** Тренеры клуба */
    @OneToMany(mappedBy = "fitnessClub", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Cat> trainers;
}
