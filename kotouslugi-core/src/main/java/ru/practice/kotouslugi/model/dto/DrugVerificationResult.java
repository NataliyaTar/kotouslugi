package ru.practice.kotouslugi.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.DrugBatchStatus;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DrugVerificationResult {
    private String batchCode;
    private boolean registered;
    private String message;
    private String tradeName;
    private String manufacturerName;
    private String serialNumber;
    private Date expiryDate;
    private DrugBatchStatus status;
}
