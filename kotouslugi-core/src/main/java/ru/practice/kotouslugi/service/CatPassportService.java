package ru.practice.kotouslugi.service;


import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.model.PassportDetail;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.PassportDTO;
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
    passportDTO.setId(passportDTO.getId());
    return passportDTO;

  }

}
