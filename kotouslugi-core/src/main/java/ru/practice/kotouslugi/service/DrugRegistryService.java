package ru.practice.kotouslugi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CounterfeitReportRepository;
import ru.practice.kotouslugi.dao.DrugBatchRepository;
import ru.practice.kotouslugi.dao.DrugRepository;
import ru.practice.kotouslugi.dao.ManufacturerRepository;
import ru.practice.kotouslugi.model.CounterfeitReport;
import ru.practice.kotouslugi.model.Drug;
import ru.practice.kotouslugi.model.DrugBatch;
import ru.practice.kotouslugi.model.Manufacturer;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.dto.DrugVerificationResult;
import ru.practice.kotouslugi.model.enums.DrugBatchStatus;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class DrugRegistryService {
    private static final Logger logger = LoggerFactory.getLogger(DrugRegistryService.class);

    private final DrugBatchRepository drugBatchRepository;
    private final DrugRepository drugRepository;
    private final ManufacturerRepository manufacturerRepository;
    private final CounterfeitReportRepository counterfeitReportRepository;
    private final ObjectMapper objectMapper;

    public DrugRegistryService(DrugBatchRepository drugBatchRepository,
                               DrugRepository drugRepository,
                               ManufacturerRepository manufacturerRepository,
                               CounterfeitReportRepository counterfeitReportRepository) {
        this.drugBatchRepository = drugBatchRepository;
        this.drugRepository = drugRepository;
        this.manufacturerRepository = manufacturerRepository;
        this.counterfeitReportRepository = counterfeitReportRepository;
        this.objectMapper = new ObjectMapper();
    }

    public DrugVerificationResult verifyBatch(String batchCode) {
        if (batchCode == null || batchCode.isBlank()) {
            return DrugVerificationResult.builder()
                    .batchCode(batchCode)
                    .registered(false)
                    .message("Код партии не указан")
                    .build();
        }

        Optional<DrugBatch> batchOpt = drugBatchRepository.findByBatchCode(batchCode.trim().toUpperCase());
        if (batchOpt.isEmpty()) {
            return DrugVerificationResult.builder()
                    .batchCode(batchCode)
                    .registered(false)
                    .message("Препарат не найден в реестре. Возможна подпольная или поддельная продукция")
                    .build();
        }

        DrugBatch batch = batchOpt.get();
        Drug drug = drugRepository.findById(batch.getDrugId()).orElse(null);
        Manufacturer manufacturer = drug != null
                ? manufacturerRepository.findById(drug.getManufacturerId()).orElse(null)
                : null;

        String message = switch (batch.getStatus()) {
            case ACTIVE -> "Препарат зарегистрирован и допущен к применению";
            case RECALLED -> "ВНИМАНИЕ: партия отозвана производителем";
            case EXPIRED -> "ВНИМАНИЕ: срок годности препарата истёк";
        };

        return DrugVerificationResult.builder()
                .batchCode(batch.getBatchCode())
                .registered(batch.getStatus() == DrugBatchStatus.ACTIVE)
                .message(message)
                .tradeName(drug != null ? drug.getTradeName() : null)
                .manufacturerName(manufacturer != null ? manufacturer.getName() : null)
                .serialNumber(batch.getSerialNumber())
                .expiryDate(batch.getExpiryDate())
                .status(batch.getStatus())
                .build();
    }

    public void processRequisition(Requisition requisition) {
        try {
            JsonNode steps = objectMapper.readTree(requisition.getFields());
            String batchCode = null;
            String description = null;
            String reporterContact = null;

            for (JsonNode step : steps) {
                if (step.has("batchCode")) {
                    batchCode = step.get("batchCode").asText();
                }
                if (step.has("reportDescription")) {
                    description = step.get("reportDescription").asText();
                }
                if (step.has("reporterContact")) {
                    reporterContact = step.get("reporterContact").asText();
                }
            }

            if (description != null && !description.isBlank() && batchCode != null) {
                CounterfeitReport report = CounterfeitReport.builder()
                        .batchCode(batchCode.trim().toUpperCase())
                        .description(description)
                        .reporterContact(reporterContact)
                        .created(new Date())
                        .status("FILED")
                        .build();
                counterfeitReportRepository.save(report);
                logger.info("Зарегистрировано обращение о подозрительном препарате: {}", batchCode);
            }
        } catch (Exception e) {
            logger.error("Ошибка обработки заявки реестра препаратов: {}", e.getMessage());
        }
    }

    public List<Manufacturer> listManufacturers() {
        List<Manufacturer> result = new LinkedList<>();
        manufacturerRepository.findAll().forEach(result::add);
        return result;
    }
}
