package ru.practice.kotouslugi.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.Data;

import lombok.RequiredArgsConstructor;
import org.hibernate.service.spi.ServiceException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;

import ru.practice.kotouslugi.exception.DuplicateEntityException;
import ru.practice.kotouslugi.exception.InvalidOperationException;
import ru.practice.kotouslugi.model.*;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import java.util.*;

@RequiredArgsConstructor
@Service
public class CatPassportService {

  private final CatPassportRepository catPassportRepository;

  private final RequisitionRepository requisitionRepository;

  public List<PassportDTO> getPassports(){
    Iterable<Requisition> requisitionsList = requisitionRepository.findAll();
    ArrayList<PassportDTO> passportDTOList = new ArrayList<>();
    requisitionsList.forEach(
      requisition -> {
        if (RequisitionStatus.DONE.equals(requisition.getStatus())){
          passportDTOList.add(BuildPassportDTO.buildPassportDTO(requisition.getPassportDetail()));
        }
      });
    return passportDTOList;
  }

  public PassportDTO addCatPassport(PassportDTO passportDTO) {
    if (catPassportRepository.existsByPassportNumber(passportDTO.getPassportNumber())){
      throw new DuplicateEntityException("Passport number already exists: " + passportDTO.getPassportNumber());
    }
    Requisition requisition = null;
    Integer requisitionId = passportDTO.getRequisition();
    if (requisitionId != null) {
      requisition = requisitionRepository.findById(requisitionId).orElse(null);
    }
    PassportDetail passportDetail = PassportDetail.builder()
      .requisition(requisition)
      .passportNumber(passportDTO.getPassportNumber())
      .issueDate(passportDTO.getIssueDate())
      .country(passportDTO.getCountry())
      .ownerPhone(passportDTO.getOwnerPhone())
      .ownerEmail(passportDTO.getOwnerEmail())
      .photoUrl(passportDTO.getPhotoUrl())
      .specialMarks(passportDTO.getSpecialMarks())
      .chipNumber(passportDTO.getChipNumber())
      .build();
    try {
      PassportDetail saved = catPassportRepository.save(passportDetail);
      passportDTO.setId(saved.getId());
      return passportDTO;
    } catch (DataIntegrityViolationException e){
      throw new InvalidOperationException(e.getMessage());
    }
  }

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
