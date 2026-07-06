package ru.practice.kotouslugi.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.RelationType;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PedigreeLinkDto {
    private Long id;
    private Long relativePassportId;
    private Long relativeCatId;
    private String relativeCatName;
    private RelationType relationType;
}
