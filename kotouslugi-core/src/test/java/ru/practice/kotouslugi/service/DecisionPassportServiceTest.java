package ru.practice.kotouslugi.service;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.exception.InvalidOperationException;
import ru.practice.kotouslugi.model.DecisionPassportDTO;
import ru.practice.kotouslugi.model.PassportDTO;
import ru.practice.kotouslugi.model.PassportDetail;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.when;
@ExtendWith(MockitoExtension.class)
public class DecisionPassportServiceTest {
  @InjectMocks
  private  DecisionPassportService decisionPassportService;
  @Mock
  private  RequisitionRepository requisitionRepository;
  @Mock
  private  CatPassportRepository catPassportRepository;

  //проверка если по всем условиям все норм
  @Test
  void approvePassportWhenAllGood(){
    int requisitionId = 1;
    Long passportDetailId = 100L;

    // Создаём заявку
    Requisition req = Requisition.builder()
      .id(requisitionId)
      .mnemonic("passport")
      .status(RequisitionStatus.FILED)
      .passportDetail(PassportDetail.builder().id(passportDetailId).build())
      .build();

    PassportDetail passportDetail = PassportDetail.builder()
      .id(passportDetailId)
      .requisition(req)
      .passportNumber("AB123456")
      .ownerPhone("+79998887766")
      .ownerEmail("test@example.com")
      .build();

    when(requisitionRepository.findById(requisitionId)).thenReturn(Optional.of(req));
    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequisitionId(requisitionId);

    PassportDTO result = decisionPassportService.approvePassport(decisionDTO);

    assertThat(result).isNotNull();
    assertThat(req.getStatus()).isEqualTo(RequisitionStatus.DONE);
    assertThat(req.getDecisionAt()).isNotNull();
  }

  @Test
  void approvePassportWhenReqNotFound(){
    int requisitionId = 999;
    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequisitionId(requisitionId);

    when(requisitionRepository.findById(requisitionId)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> decisionPassportService.approvePassport(decisionDTO))
      .isInstanceOf(EntityNotFoundException.class)
      .hasMessageContaining("Requisition not found with id");
  }
  @Test
  void approvePassportWhenConditionsNotMet(){
    int requisitionId = 1;
    Long passportDetailId = 100L;

    // Создаём заявку
    Requisition req = Requisition.builder()
      .id(requisitionId)
      .mnemonic("not passport")
      .status(RequisitionStatus.FILED)
      .passportDetail(PassportDetail.builder().id(passportDetailId).build())
      .build();

    PassportDetail passportDetail = PassportDetail.builder()
      .id(passportDetailId)
      .requisition(req)
      .passportNumber("AB123456")
      .ownerPhone("+79998887766")
      .ownerEmail("test@example.com")
      .build();

    when(requisitionRepository.findById(requisitionId)).thenReturn(Optional.of(req));


    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequisitionId(requisitionId);

    assertThatThrownBy(() -> decisionPassportService.approvePassport(decisionDTO))
      .isInstanceOf(InvalidOperationException.class)
      .hasMessageContaining("Invalid order mnemonic or status");

  }
  @Test
  void approvePassportWhenConditionsNotMet1(){
    int requisitionId = 1;
    Long passportDetailId = 100L;

    // Создаём заявку
    Requisition req = Requisition.builder()
      .id(requisitionId)
      .mnemonic("passport")
      .status(RequisitionStatus.DONE)
      .passportDetail(PassportDetail.builder().id(passportDetailId).build())
      .build();

    when(requisitionRepository.findById(requisitionId)).thenReturn(Optional.of(req));


    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequisitionId(requisitionId);

    assertThatThrownBy(() -> decisionPassportService.approvePassport(decisionDTO))
      .isInstanceOf(InvalidOperationException.class)
      .hasMessageContaining("Invalid order mnemonic or status");

  }
  @Test
  void rejectPassportWhenAllGood(){
    int requisitionId = 1;
    Long passportDetailId = 100L;

    // Создаём заявку
    Requisition req = Requisition.builder()
      .id(requisitionId)
      .mnemonic("passport")
      .status(RequisitionStatus.FILED)
      .passportDetail(PassportDetail.builder().id(passportDetailId).build())
      .build();

    PassportDetail passportDetail = PassportDetail.builder()
      .id(passportDetailId)
      .requisition(req)
      .passportNumber("AB123456")
      .ownerPhone("+79998887766")
      .ownerEmail("test@example.com")
      .build();

    when(requisitionRepository.findById(requisitionId)).thenReturn(Optional.of(req));

    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequisitionId(requisitionId);

    PassportDTO result = decisionPassportService.rejectPassport(decisionDTO);

    assertThat(result).isNotNull();
    assertThat(req.getStatus()).isEqualTo(RequisitionStatus.REJECTED);
    assertThat(req.getDecisionAt()).isNotNull();

  }

  @Test
  void rejectPassportWhenReqNotFound(){
    int requisitionId = 999;
    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequisitionId(requisitionId);

    when(requisitionRepository.findById(requisitionId)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> decisionPassportService.rejectPassport(decisionDTO))
      .isInstanceOf(EntityNotFoundException.class)
      .hasMessageContaining("Requisition not found with id");
  }
  @Test
  void rejectPassportWhenConditionsNotMet(){
    int requisitionId = 1;
    Long passportDetailId = 100L;

    // Создаём заявку
    Requisition req = Requisition.builder()
      .id(requisitionId)
      .mnemonic("not passport")
      .status(RequisitionStatus.FILED)
      .passportDetail(PassportDetail.builder().id(passportDetailId).build())
      .build();

    PassportDetail passportDetail = PassportDetail.builder()
      .id(passportDetailId)
      .requisition(req)
      .passportNumber("AB123456")
      .ownerPhone("+79998887766")
      .ownerEmail("test@example.com")
      .build();

    when(requisitionRepository.findById(requisitionId)).thenReturn(Optional.of(req));


    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequisitionId(requisitionId);

    assertThatThrownBy(() -> decisionPassportService.rejectPassport(decisionDTO))
      .isInstanceOf(InvalidOperationException.class)
      .hasMessageContaining("Invalid order mnemonic or status");

  }

  @Test
  void rejectPassportWhenConditionsNotMet1(){
    int requisitionId = 1;
    Long passportDetailId = 100L;

    // Создаём заявку
    Requisition req = Requisition.builder()
      .id(requisitionId)
      .mnemonic("passport")
      .status(RequisitionStatus.DONE)
      .passportDetail(PassportDetail.builder().id(passportDetailId).build())
      .build();


    when(requisitionRepository.findById(requisitionId)).thenReturn(Optional.of(req));


    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequisitionId(requisitionId);

    assertThatThrownBy(() -> decisionPassportService.rejectPassport(decisionDTO))
      .isInstanceOf(InvalidOperationException.class)
      .hasMessageContaining("Invalid order mnemonic or status");

  }
}
