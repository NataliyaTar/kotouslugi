package ru.practice.kotouslugi.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroomingReviewRequest {
    private Long appointmentId;
    private Integer rating;
    private String comment;
}
