package ru.practice.kotouslugi.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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

  @Transactional
  public PassportDTO approvePassport(DecisionPassportDTO decisionPassportDTO){
    Requisition req = requisitionRepository.findById(decisionPassportDTO.getRequisitionId())
      .orElseThrow(() -> new EntityNotFoundException("Requisition not found with id "));

    if ("passport".equals(req.getMnemonic()) && req.getStatus() == RequisitionStatus.FILED){
      req.setStatus(RequisitionStatus.DONE);
      req.setDecisionAt(new Date(System.currentTimeMillis()));
      requisitionRepository.save(req);


      PassportDetail passportDetail = req.getPassportDetail();
      passportDetail.setRequisition(req);
      passportDetail.setStatus(true);

      catPassportRepository.save(passportDetail);
      return BuildPassportDTO.buildPassportDTO(passportDetail);

    }else {
      throw new InvalidOperationException("Invalid order mnemonic or status");
    }
  }

  @Transactional
  public PassportDTO rejectPassport(DecisionPassportDTO decisionPassportDTO){


    Requisition req = requisitionRepository.findById(decisionPassportDTO.getRequisitionId())
      .orElseThrow(() -> new EntityNotFoundException("Requisition not found with id"));

    if ("passport".equals(req.getMnemonic()) && req.getStatus() == RequisitionStatus.FILED){
      req.setStatus(RequisitionStatus.REJECTED);
      req.setDecisionAt(new Date(System.currentTimeMillis()));
      requisitionRepository.save(req);

      PassportDetail passportDetail = req.getPassportDetail();
      passportDetail.setStatus(false);
      passportDetail.setRequisition(req);

      return BuildPassportDTO.buildPassportDTO(passportDetail);


    }else {
      throw new InvalidOperationException("Invalid order mnemonic or status");
    }
  }
}
