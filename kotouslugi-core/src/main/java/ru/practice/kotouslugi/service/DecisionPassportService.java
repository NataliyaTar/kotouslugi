package ru.practice.kotouslugi.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.exception.InvalidOperationException;
import ru.practice.kotouslugi.model.*;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import java.util.Date;
@RequiredArgsConstructor
@Service
public class DecisionPassportService {
  private final CatPassportRepository catPassportRepository;

  private final RequisitionRepository requisitionRepository;


  public PassportDTO approvePassport(DecisionPassportDTO decisionPassportDTO){
    Requisition req = requisitionRepository.findById(decisionPassportDTO.getRequestionId())
      .orElseThrow(() -> new EntityNotFoundException("Requisition not found with id "));

    if ("passport".equals(req.getMnemonic()) && req.getStatus() == RequisitionStatus.FILED){
      req.setStatus(RequisitionStatus.DONE);


      PassportDetail passportDetail = catPassportRepository.findById(req.getPassportDetail().getId())
        .orElseThrow(() -> new EntityNotFoundException("Not found passportDetail with id " + req.getPassportDetail().getId()));

      PassportDTO passportDTO = BuildPassportDTO.buildPassportDTO(passportDetail);

      req.setDecisionAt(new Date(System.currentTimeMillis()));
      requisitionRepository.save(req);
      return passportDTO;

    }else {
      throw new InvalidOperationException("Invalid order mnemonic or status");
    }
  }


  public PassportDTO rejectPassport(DecisionPassportDTO decisionPassportDTO){


    Requisition req = requisitionRepository.findById(decisionPassportDTO.getRequestionId())
      .orElseThrow(() -> new EntityNotFoundException("Requisition not found with id "));

    if ("passport".equals(req.getMnemonic()) && req.getStatus() == RequisitionStatus.FILED){
      req.setStatus(RequisitionStatus.REJECTED);


      PassportDetail passportDetail = catPassportRepository.findById(req.getPassportDetail().getId())
        .orElseThrow(() -> new EntityNotFoundException("Not found passportDetail with id " + req.getPassportDetail().getId()));

      PassportDTO passportDTO = BuildPassportDTO.buildPassportDTO(passportDetail);

      req.setDecisionAt(new Date(System.currentTimeMillis()));
      requisitionRepository.save(req);
      return passportDTO;

    }else {
      throw new InvalidOperationException("Invalid order mnemonic or status");
    }
  }
}
