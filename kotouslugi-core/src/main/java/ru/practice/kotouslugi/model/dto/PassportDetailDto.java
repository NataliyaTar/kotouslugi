package ru.practice.kotouslugi.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.IllnessRecord;
import ru.practice.kotouslugi.model.PedigreeLink;
import ru.practice.kotouslugi.model.Vaccination;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassportDetailDto {
    private Long id;
    private Long catId;
    private String catName;
    private String chipNumber;
    private String kennelName;
    private Boolean verified;
    @Builder.Default
    private List<Vaccination> vaccinations = new ArrayList<>();
    @Builder.Default
    private List<IllnessRecord> illnesses = new ArrayList<>();
    @Builder.Default
    private List<PedigreeLinkDto> pedigreeLinks = new ArrayList<>();
    @Builder.Default
    private List<String> inbreedingWarnings = new ArrayList<>();
}
