package ru.practice.kotouslugi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.practice.kotouslugi.dao.AnimalPassportRepository;
import ru.practice.kotouslugi.dao.CatRepository;
import ru.practice.kotouslugi.dao.IllnessRecordRepository;
import ru.practice.kotouslugi.dao.PedigreeLinkRepository;
import ru.practice.kotouslugi.dao.VaccinationRepository;
import ru.practice.kotouslugi.model.AnimalPassport;
import ru.practice.kotouslugi.model.Cat;
import ru.practice.kotouslugi.model.IllnessRecord;
import ru.practice.kotouslugi.model.PedigreeLink;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.Vaccination;
import ru.practice.kotouslugi.model.dto.PassportDetailDto;
import ru.practice.kotouslugi.model.dto.PedigreeLinkDto;
import ru.practice.kotouslugi.model.enums.RelationType;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PassportService {
    private static final Logger logger = LoggerFactory.getLogger(PassportService.class);

    private final AnimalPassportRepository passportRepository;
    private final VaccinationRepository vaccinationRepository;
    private final IllnessRecordRepository illnessRecordRepository;
    private final PedigreeLinkRepository pedigreeLinkRepository;
    private final CatRepository catRepository;
    private final ObjectMapper objectMapper;

    public PassportService(AnimalPassportRepository passportRepository,
                           VaccinationRepository vaccinationRepository,
                           IllnessRecordRepository illnessRecordRepository,
                           PedigreeLinkRepository pedigreeLinkRepository,
                           CatRepository catRepository) {
        this.passportRepository = passportRepository;
        this.vaccinationRepository = vaccinationRepository;
        this.illnessRecordRepository = illnessRecordRepository;
        this.pedigreeLinkRepository = pedigreeLinkRepository;
        this.catRepository = catRepository;
        this.objectMapper = new ObjectMapper();
    }

    public List<PassportDetailDto> listPassports() {
        List<PassportDetailDto> result = new LinkedList<>();
        passportRepository.findAll().forEach(p -> result.add(buildDetail(p.getId())));
        return result;
    }

    public PassportDetailDto getPassport(Long id) {
        return buildDetail(id);
    }

    public PassportDetailDto getPassportByCatId(Long catId) {
        Optional<AnimalPassport> passport = passportRepository.findByCatId(catId);
        return passport.map(p -> buildDetail(p.getId())).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<PassportDetailDto> searchPassports(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        String trimmed = query.trim();
        Long passportId = null;
        try {
            passportId = Long.parseLong(trimmed);
        } catch (NumberFormatException ignored) {
        }

        List<PassportDetailDto> result = new LinkedList<>();
        for (AnimalPassport passport : passportRepository.search(trimmed, passportId)) {
            PassportDetailDto detail = buildDetail(passport.getId());
            if (detail != null) {
                result.add(detail);
            }
        }
        return result;
    }

    public void createFromRequisition(Requisition requisition) {
        try {
            JsonNode steps = objectMapper.readTree(requisition.getFields());
            Long catId = null;
            String chipNumber = null;
            String kennelName = null;

            for (JsonNode step : steps) {
                if (step.has("cat")) {
                    catId = step.get("cat").asLong();
                }
                if (step.has("chipNumber")) {
                    chipNumber = step.get("chipNumber").asText();
                }
                if (step.has("kennelName")) {
                    kennelName = step.get("kennelName").asText();
                }
            }

            if (catId == null) {
                logger.warn("Не удалось создать паспорт: catId не указан");
                return;
            }

            AnimalPassport passport = passportRepository.findByCatId(catId)
                    .orElse(AnimalPassport.builder()
                            .catId(catId)
                            .verified(false)
                            .created(new Date())
                            .build());

            passport.setChipNumber(chipNumber);
            passport.setKennelName(kennelName);
            passport = passportRepository.save(passport);

            saveVaccinationFromSteps(passport.getId(), steps);
            savePedigreeFromSteps(passport.getId(), steps);
            saveIllnessFromSteps(passport.getId(), steps);

            logger.info("Паспорт животного создан/обновлён для кота id={}", catId);
        } catch (Exception e) {
            logger.error("Ошибка создания паспорта из заявки: {}", e.getMessage());
        }
    }

    private void saveVaccinationFromSteps(Long passportId, JsonNode steps) {
        for (JsonNode step : steps) {
            if (!step.has("vaccineName")) {
                continue;
            }
            String vaccineName = step.get("vaccineName").asText();
            if (vaccineName == null || vaccineName.isBlank()) {
                continue;
            }
            Vaccination vaccination = Vaccination.builder()
                    .passportId(passportId)
                    .vaccineName(vaccineName)
                    .drugBatchCode(getText(step, "drugBatchCode"))
                    .vaccinationDate(parseDate(getText(step, "vaccinationDate")))
                    .veterinarian(getText(step, "veterinarian"))
                    .clinic(getText(step, "clinic"))
                    .verified(false)
                    .build();
            vaccinationRepository.save(vaccination);
        }
    }

    private void savePedigreeFromSteps(Long passportId, JsonNode steps) {
        for (JsonNode step : steps) {
            if (!step.has("relativeCat") || step.get("relativeCat").isNull()) {
                continue;
            }
            JsonNode relativeCatNode = step.get("relativeCat");
            if (!relativeCatNode.isNumber() && (relativeCatNode.isTextual() && relativeCatNode.asText().isBlank())) {
                continue;
            }
            if (!step.has("relationType") || step.get("relationType").isNull()) {
                continue;
            }

            Long relativeCatId = relativeCatNode.asLong();
            String relationTypeStr = step.get("relationType").asText();
            if (relationTypeStr.isBlank()) {
                continue;
            }

            AnimalPassport relativePassport = passportRepository.findByCatId(relativeCatId)
                    .orElseGet(() -> {
                        AnimalPassport created = AnimalPassport.builder()
                                .catId(relativeCatId)
                                .verified(false)
                                .created(new Date())
                                .build();
                        return passportRepository.save(created);
                    });

            RelationType relationType = RelationType.valueOf(relationTypeStr);
            PedigreeLink link = PedigreeLink.builder()
                    .passportId(passportId)
                    .relativePassportId(relativePassport.getId())
                    .relationType(relationType)
                    .build();
            pedigreeLinkRepository.save(link);
        }
    }

    private void saveIllnessFromSteps(Long passportId, JsonNode steps) {
        for (JsonNode step : steps) {
            if (!step.has("diagnosis")) {
                continue;
            }
            String diagnosis = step.get("diagnosis").asText();
            if (diagnosis == null || diagnosis.isBlank()) {
                continue;
            }
            IllnessRecord record = IllnessRecord.builder()
                    .passportId(passportId)
                    .diagnosis(diagnosis)
                    .treatment(getText(step, "treatment"))
                    .recordDate(parseDate(getText(step, "recordDate")))
                    .recovered(step.has("recovered") && step.get("recovered").asBoolean())
                    .build();
            illnessRecordRepository.save(record);
        }
    }

    private PassportDetailDto buildDetail(Long passportId) {
        AnimalPassport passport = passportRepository.findById(passportId).orElse(null);
        if (passport == null) {
            return null;
        }

        Cat cat = catRepository.findById(passport.getCatId()).orElse(null);
        List<PedigreeLinkDto> pedigreeLinks = new ArrayList<>();
        pedigreeLinkRepository.findByPassportId(passportId).forEach(link -> {
            AnimalPassport relative = passportRepository.findById(link.getRelativePassportId()).orElse(null);
            Cat relativeCat = relative != null ? catRepository.findById(relative.getCatId()).orElse(null) : null;
            pedigreeLinks.add(PedigreeLinkDto.builder()
                    .id(link.getId())
                    .relativePassportId(link.getRelativePassportId())
                    .relativeCatId(relative != null ? relative.getCatId() : null)
                    .relativeCatName(relativeCat != null ? relativeCat.getName() : "—")
                    .relationType(link.getRelationType())
                    .build());
        });

        return PassportDetailDto.builder()
                .id(passport.getId())
                .catId(passport.getCatId())
                .catName(cat != null ? cat.getName() : "—")
                .chipNumber(passport.getChipNumber())
                .kennelName(passport.getKennelName())
                .verified(passport.getVerified())
                .vaccinations(vaccinationRepository.findByPassportId(passportId))
                .illnesses(illnessRecordRepository.findByPassportId(passportId))
                .pedigreeLinks(pedigreeLinks)
                .inbreedingWarnings(detectInbreedingWarnings(passportId))
                .build();
    }

    List<String> detectInbreedingWarnings(Long passportId) {
        List<String> warnings = new ArrayList<>();
        List<PedigreeLink> links = pedigreeLinkRepository.findByPassportId(passportId);

        Long fatherPassportId = null;
        Long motherPassportId = null;
        for (PedigreeLink link : links) {
            if (link.getRelationType() == RelationType.FATHER) {
                fatherPassportId = link.getRelativePassportId();
            }
            if (link.getRelationType() == RelationType.MOTHER) {
                motherPassportId = link.getRelativePassportId();
            }
        }

        if (fatherPassportId != null && motherPassportId != null) {
            Set<Long> fatherAncestors = collectAncestors(fatherPassportId, 3);
            Set<Long> motherAncestors = collectAncestors(motherPassportId, 3);
            fatherAncestors.retainAll(motherAncestors);
            if (!fatherAncestors.isEmpty()) {
                warnings.add("Обнаружен риск инбридинга: у отца и матери есть общие предки");
            }
        }

        for (PedigreeLink link : links) {
            if (link.getRelationType() == RelationType.SIBLING) {
                Set<Long> selfAncestors = collectAncestors(passportId, 2);
                Set<Long> siblingAncestors = collectAncestors(link.getRelativePassportId(), 2);
                selfAncestors.retainAll(siblingAncestors);
                if (selfAncestors.size() > 1) {
                    warnings.add("Близкое родство с сиблингом: возможен риск инбридинга при разведении");
                }
            }
        }

        return warnings;
    }

    private Set<Long> collectAncestors(Long passportId, int maxDepth) {
        Set<Long> ancestors = new HashSet<>();
        collectAncestorsRecursive(passportId, 0, maxDepth, ancestors, new HashSet<>());
        return ancestors;
    }

    private void collectAncestorsRecursive(Long passportId, int depth, int maxDepth,
                                           Set<Long> ancestors, Set<Long> visited) {
        if (passportId == null || depth > maxDepth || visited.contains(passportId)) {
            return;
        }
        visited.add(passportId);
        List<PedigreeLink> links = pedigreeLinkRepository.findByPassportId(passportId);
        for (PedigreeLink link : links) {
            if (link.getRelationType() == RelationType.FATHER || link.getRelationType() == RelationType.MOTHER) {
                ancestors.add(link.getRelativePassportId());
                collectAncestorsRecursive(link.getRelativePassportId(), depth + 1, maxDepth, ancestors, visited);
            }
        }
    }

    private String getText(JsonNode node, String field) {
        return node.has(field) && !node.get(field).isNull() ? node.get(field).asText() : null;
    }

    private Date parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return new SimpleDateFormat("yyyy-MM-dd").parse(value);
        } catch (Exception e) {
            return null;
        }
    }
}
