package ru.practice.kotouslugi.service;


import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Id;
import lombok.Data;

import org.hibernate.service.spi.ServiceException;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;

import ru.practice.kotouslugi.model.*;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import java.util.*;

@Data
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

    Requisition requisition = requisitionRepository.findById(passportDTO.getRequisition())
      .orElseThrow(() -> new ServiceException("Requisition not found with id: " + passportDTO.getRequisition()));

    PassportDetail passportDetail = PassportDetail.builder()
      .requisition(requisition)
      .passportNumber(passportDTO.getPassportNumber())
      .issueDate(passportDTO.getIssueDate())
      .ownerPhone(passportDTO.getOwnerPhone())
      .ownerEmail(passportDTO.getOwnerEmail())
      .photoUrl(passportDTO.getPhotoUrl())
      .specialMarks(passportDTO.getSpecialMarks())
      .chipNumber(passportDTO.getChipNumber())
      .build();

    catPassportRepository.save(passportDetail);
    passportDTO.setId(passportDetail.getId());
    return passportDTO;

  }

  public PassportDTO approvePassport(DecisionPassportDTO decisionPassportDTO){
    Requisition req = requisitionRepository.findById(decisionPassportDTO.getRequestionId())
      .orElseThrow(() -> new ServiceException("Requisition not found with id "));

    if ("passport".equals(req.getMnemonic()) && req.getStatus() == RequisitionStatus.FILED){
      req.setStatus(RequisitionStatus.DONE);


      PassportDetail passportDetail = catPassportRepository.findById(req.getPassportDetail().getId())
        .orElseThrow(() -> new ServiceException("Not found passportDetail with id " + req.getPassportDetail().getId()));

      PassportDTO passportDTO = BuildPassportDTO.buildPassportDTO(passportDetail);

      req.setDecisionAt(new Date(System.currentTimeMillis()));
      requisitionRepository.save(req);
      return passportDTO;

    }else {
      throw new ServiceException("Invalid order mnemonic or status");
    }
  }

  public PassportDTO rejectPassport(DecisionPassportDTO decisionPassportDTO){
    Requisition req = requisitionRepository.findById(decisionPassportDTO.getRequestionId())
      .orElseThrow(() -> new ServiceException("Requisition not found with id "));

    if ("passport".equals(req.getMnemonic()) && req.getStatus() == RequisitionStatus.FILED){
      req.setStatus(RequisitionStatus.REJECTED);


      PassportDetail passportDetail = catPassportRepository.findById(req.getPassportDetail().getId())
        .orElseThrow(() -> new ServiceException("Not found passportDetail with id " + req.getPassportDetail().getId()));

      PassportDTO passportDTO = BuildPassportDTO.buildPassportDTO(passportDetail);

      req.setDecisionAt(new Date(System.currentTimeMillis()));
      requisitionRepository.save(req);
      return passportDTO;

    }else {
      throw new ServiceException("Invalid order mnemonic or status");
    }
  }

}
