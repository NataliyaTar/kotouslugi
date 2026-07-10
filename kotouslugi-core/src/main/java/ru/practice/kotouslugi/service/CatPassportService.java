package ru.practice.kotouslugi.service;


import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.model.ApprovePassportDTO;
import ru.practice.kotouslugi.model.PassportDetail;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.PassportDTO;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

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
      .orElseThrow(() -> new EntityNotFoundException("Requisition not found with id "));
    if (!req.getMnemonic().equals("passport") && req.getStatus() != RequisitionStatus.DONE);

    PassportDTO passportDTO = PassportDTO.builder().
      id(req.getPassportDetail().getId()).
      requisition(req.getPassportDetail().getRequisition().getId()).
      passportNumber(req.getPassportDetail().getPassportNumber()).
      issueDate(req.getPassportDetail().getIssueDate()).
      ownerPhone(req.getPassportDetail().getOwnerPhone()).
      ownerEmail(req.getPassportDetail().getOwnerEmail()).
      photoUrl(req.getPassportDetail().getPhotoUrl()).
      specialMarks(req.getPassportDetail().getSpecialMarks()).
      chipNumber(req.getPassportDetail().getChipNumber())
      .build();
    req.setStatus(RequisitionStatus.ACCEPTED);
      return passportDTO;
  }
}
