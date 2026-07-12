package ru.practice.kotouslugi.service;


import jakarta.persistence.EntityNotFoundException;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.model.ApprovePassportDTO;
import ru.practice.kotouslugi.model.PassportDetail;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.PassportDTO;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Service
public class CatPassportService {
  @Autowired
  private CatPassportRepository catPassportRepository;
  @Autowired
  private RequisitionRepository requisitionRepository;

  public PassportDTO addCatPassport(PassportDTO passportDTO){

    Requisition requisition = requisitionRepository.findById(passportDTO.getRequisition())
      .orElseThrow(() -> new EntityNotFoundException("Requisition not found with id: " + passportDTO.getRequisition()));

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

  public PassportDTO approvePassport(ApprovePassportDTO approvePassportDTO){
    Requisition req = requisitionRepository.findById(approvePassportDTO.getRequestionId())
      .orElseThrow(() -> new ServiceException("Requisition not found with id "));

    if (req.getMnemonic().equals("passport") && req.getStatus() == RequisitionStatus.FILED){
      req.setStatus(RequisitionStatus.DONE);


      PassportDetail passportDetail = catPassportRepository.findById(req.getPassportDetail().getId())
        .orElseThrow(() -> new ServiceException("Not found passportDetail with id " + req.getPassportDetail().getId()));

      PassportDTO passportDTO = PassportDTO.builder()
        .id(passportDetail.getId())
        .requisition(passportDetail.getRequisition().getId())
        .passportNumber(passportDetail.getPassportNumber())
        .issueDate(passportDetail.getIssueDate())
        .ownerPhone(passportDetail.getOwnerPhone())
        .ownerEmail(passportDetail.getOwnerEmail())
        .photoUrl(passportDetail.getPhotoUrl())
        .specialMarks(passportDetail.getSpecialMarks())
        .chipNumber(passportDetail.getChipNumber())
        .build();
      req.setApprovedAt(new Date(System.currentTimeMillis()));
      requisitionRepository.save(req);
      return passportDTO;

    }else {
      throw new ServiceException("Invalid order mnemonic or status");
    }
  }


}
