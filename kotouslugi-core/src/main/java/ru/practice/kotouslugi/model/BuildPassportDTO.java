package ru.practice.kotouslugi.model;

import java.util.Date;

public class BuildPassportDTO {
  public static PassportDTO buildPassportDTO(PassportDetail passportDetail) {
    return PassportDTO.builder()
      .id(passportDetail.getId())
      .requisition(passportDetail.getRequisition().getId()) // предполагается, что requisition не null

      .passportNumber(passportDetail.getPassportNumber())
      .issueDate(passportDetail.getIssueDate())
      .ownerPhone(passportDetail.getOwnerPhone())
      .ownerEmail(passportDetail.getOwnerEmail())
      .photoUrl(passportDetail.getPhotoUrl())
      .specialMarks(passportDetail.getSpecialMarks())
      .chipNumber(passportDetail.getChipNumber())
      .status(passportDetail.isStatus())
      .build();

  }

}
