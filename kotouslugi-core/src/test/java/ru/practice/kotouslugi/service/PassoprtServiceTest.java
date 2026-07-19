package ru.practice.kotouslugi.service;

import jakarta.persistence.EntityNotFoundException;
import org.hibernate.service.spi.ServiceException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.stereotype.Service;
import static org.assertj.core.api.Assertions.assertThat;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.exception.DuplicateEntityException;
import ru.practice.kotouslugi.exception.InvalidOperationException;
import ru.practice.kotouslugi.model.DecisionPassportDTO;
import ru.practice.kotouslugi.model.PassportDTO;
import ru.practice.kotouslugi.model.PassportDetail;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PassoprtServiceTest {
  @Mock
  private RequisitionRepository requisitionRepository;

  @Mock
  private CatPassportRepository catPassportRepository;

  @Mock
  private  DecisionPassportService decisionPassportService;
  @InjectMocks
  private CatPassportService passportService;
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
    when(catPassportRepository.findById(passportDetailId)).thenReturn(Optional.of(passportDetail));

    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequestionId(requisitionId);

    PassportDTO result = decisionPassportService.approvePassport(decisionDTO);

    assertThat(result).isNotNull();
    assertThat(req.getStatus()).isEqualTo(RequisitionStatus.DONE);
    assertThat(req.getDecisionAt()).isNotNull();
  }

  @Test
  void approvePassportWhenReqNotFound(){
    int requisitionId = 999;
    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequestionId(requisitionId);

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
    decisionDTO.setRequestionId(requisitionId);

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
    decisionDTO.setRequestionId(requisitionId);

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
    when(catPassportRepository.findById(passportDetailId)).thenReturn(Optional.of(passportDetail));

    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequestionId(requisitionId);

    PassportDTO result = decisionPassportService.rejectPassport(decisionDTO);

    assertThat(result).isNotNull();
    assertThat(req.getStatus()).isEqualTo(RequisitionStatus.REJECTED);
    assertThat(req.getDecisionAt()).isNotNull();

  }

  @Test
  void rejectPassportWhenReqNotFound(){
    int requisitionId = 999;
    DecisionPassportDTO decisionDTO = new DecisionPassportDTO();
    decisionDTO.setRequestionId(requisitionId);

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
    decisionDTO.setRequestionId(requisitionId);

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
    decisionDTO.setRequestionId(requisitionId);

    assertThatThrownBy(() -> decisionPassportService.rejectPassport(decisionDTO))
      .isInstanceOf(InvalidOperationException.class)
      .hasMessageContaining("Invalid order mnemonic or status");

  }
  @Test
  void getPassportWnenAllGood(){
    Long passportDetailId = 1L;
    int requisitionId = 999;

    Requisition req = Requisition.builder()
      .id(requisitionId)
      .mnemonic("passport")
      .status(RequisitionStatus.FILED)
      .passportDetail(PassportDetail.builder().id(passportDetailId).build())
      .build();

    Requisition doneReq = Requisition.builder()
      .status(RequisitionStatus.DONE)
      .passportDetail(PassportDetail.builder()
        .id(1L)
        .passportNumber("AB123")
        .requisition(req)
        .ownerPhone("+79998887766")
        .ownerEmail("test@example.com")
        .build())
      .build();

    Requisition filedReq = Requisition.builder()
      .status(RequisitionStatus.FILED)
      .build();

    Requisition rejectedReq = Requisition.builder()
      .status(RequisitionStatus.REJECTED)
      .build();

    when(requisitionRepository.findAll()).thenReturn(List.of(doneReq, filedReq, rejectedReq));

    List<PassportDTO> result = passportService.getPassports();

    assertThat(result).hasSize(1);
    PassportDTO dto = result.get(0);
    assertThat(dto.getPassportNumber()).isEqualTo("AB123");
  }
  @Test
  void getPassportWnenRepoIsEmpty(){

    Requisition filedReq = Requisition.builder()
      .status(RequisitionStatus.FILED)
      .build();

    Requisition rejectedReq = Requisition.builder()
      .status(RequisitionStatus.REJECTED)
      .build();

    when(requisitionRepository.findAll()).thenReturn(List.of(filedReq, rejectedReq));

    List<PassportDTO> result = passportService.getPassports();

    assertThat(result).isEmpty();

  }


  @Test
  void addCatPassportWhenAllGood(){
    int requisitionId = 1;
    Long expectedPassportId = 100L;

    PassportDTO passportDTO = PassportDTO.builder()
      .requisition(requisitionId)
      .passportNumber("AB123456")
      .issueDate(LocalDate.of(2025, 1, 1))
      .ownerPhone("+79998887766")
      .ownerEmail("test@example.com")
      .photoUrl("http://example.com/photo.jpg")
      .specialMarks("Особые отметки")
      .chipNumber("CHIP987")
      .build();

    Requisition requisition = Requisition.builder()
      .id(1)
      .mnemonic("passport")
      .status(RequisitionStatus.FILED)
      .passportDetail(PassportDetail.builder().id(100L).build())
      .build();

    when(requisitionRepository.findById(passportDTO.getRequisition())).thenReturn(Optional.of(requisition));


    when(catPassportRepository.save(any(PassportDetail.class))).thenAnswer(invocation -> {
      PassportDetail arg = invocation.getArgument(0);
      arg.setId(expectedPassportId);  // устанавливаем id
      return arg;                     // возвращаем тот же объект
    });
    PassportDTO resultDTO = passportService.addCatPassport(passportDTO);

    assertThat(resultDTO).isNotNull();
    assertThat(resultDTO.getId()).isEqualTo(expectedPassportId);
    assertThat(resultDTO).isSameAs(passportDTO);
  }

  //если заявка не найдена
  @Test
  void addCatPassportWhenReqIsNull(){
    Integer requisitionId = null;
    Long expectedPassportId = 100L;

    PassportDTO passportDTO = PassportDTO.builder()
      .requisition(requisitionId)
      .passportNumber("AB123456")
      .issueDate(LocalDate.of(2025, 1, 1))
      .ownerPhone("+79998887766")
      .ownerEmail("test@example.com")
      .photoUrl("http://example.com/photo.jpg")
      .specialMarks("Особые отметки")
      .chipNumber("CHIP987")
      .build();

    when(catPassportRepository.save(any(PassportDetail.class))).thenAnswer(invocation -> {
      PassportDetail arg = invocation.getArgument(0);
      arg.setId(expectedPassportId);  // устанавливаем id
      return arg;                     // возвращаем тот же объект
    });
    PassportDTO resultDTO = passportService.addCatPassport(passportDTO);

    assertThat(resultDTO).isNotNull();
    assertThat(resultDTO.getId()).isEqualTo(expectedPassportId);
    assertThat(resultDTO).isSameAs(passportDTO);

  }

  @Test
  void addCatPassportWhenPassportNumberHadDuplicate(){
    Integer requisitionId = null;
    Long expectedPassportId = 100L;


    PassportDTO firstDTO = PassportDTO.builder()
      .requisition(requisitionId)
      .passportNumber("AB123456")
      .issueDate(LocalDate.of(2025, 1, 1))
      .ownerPhone("+79998887766")
      .ownerEmail("test@example.com")
      .photoUrl("http://example.com/photo.jpg")
      .specialMarks("Особые отметки")
      .chipNumber("CHIP987")
      .build();

    PassportDTO secondDTO = PassportDTO.builder()
      .requisition(requisitionId)
      .passportNumber("AB123456") // тот же номер
      .issueDate(LocalDate.of(2025, 1, 1))
      .ownerPhone("+79128587206")
      .ownerEmail("test1@example.com")
      .photoUrl("http://example1.com/photo1.jpg")
      .specialMarks("Особые отметки1")
      .chipNumber("CHIP9871")
      .build();


    when(catPassportRepository.existsByPassportNumber(firstDTO.getPassportNumber()))
      .thenReturn(false, true);

    when(catPassportRepository.save(any(PassportDetail.class))).thenAnswer(invocation -> {
      PassportDetail arg = invocation.getArgument(0);
      arg.setId(expectedPassportId);
      return arg;
    });

    PassportDTO resultDTO = passportService.addCatPassport(firstDTO);

    assertThat(resultDTO).isNotNull();
    assertThat(resultDTO.getId()).isEqualTo(expectedPassportId);
    assertThat(resultDTO).isSameAs(firstDTO);

    assertThatThrownBy(() -> passportService.addCatPassport(secondDTO))
      .isInstanceOf(DuplicateEntityException.class)
      .hasMessageContaining("Passport number already exists");

  }
}
