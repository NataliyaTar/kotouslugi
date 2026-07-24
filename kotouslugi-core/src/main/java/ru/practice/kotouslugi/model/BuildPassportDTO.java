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
  public static VoteRecord createVoteRecord(CreateVoteRecordDto dto) {
    return VoteRecord.builder()
      .catId(dto.getCatId())
      .partyId(dto.getPartyId())
      .voteDate(new Date())
      .electionPeriod(dto.getElectionPeriod())
      .voteSource(dto.getVoteSource())
      .encryptedVote(dto.getEncryptedVote())
      .build();
  }
}
