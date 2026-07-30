package ru.practice.kotouslugi.service;


import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
    Iterable<PassportDetail> passportS = catPassportRepository.findAll();
    List<PassportDTO> passportDTOS = new ArrayList<>();
    passportS.forEach(passportDetail -> {
      if (passportDetail.isStatus()){
        passportDTOS.add(BuildPassportDTO.buildPassportDTO(passportDetail));}
      }
      );
    return passportDTOS;

  }

  @Transactional
  public PassportDTO addCatPassport(PassportDTO passportDTO) {
    if (catPassportRepository.existsByPassportNumber(passportDTO.getPassportNumber())){
      throw new DuplicateEntityException();
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
      .status(true)
      .build();
    try {
      PassportDetail saved = catPassportRepository.save(passportDetail);
      passportDTO.setId(saved.getId());
      passportDTO.setStatus(true);
      return passportDTO;
    } catch (DataIntegrityViolationException e){
      throw new InvalidOperationException(e.getMessage());
    }
  }



}
