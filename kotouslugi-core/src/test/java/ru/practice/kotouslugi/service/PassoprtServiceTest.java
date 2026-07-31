package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.exception.DuplicateEntityException;
import ru.practice.kotouslugi.model.PassportDTO;
import ru.practice.kotouslugi.model.PassportDetail;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PassoprtServiceTest {

  @Mock
  private RequisitionRepository requisitionRepository;

  @Mock
  private CatPassportRepository catPassportRepository;

  @Mock
  private DecisionPassportService decisionPassportService;

  @InjectMocks
  private CatPassportService passportService;

  private Requisition baseRequisition;
  private PassportDTO basePassportDTO;
  private PassportDetail basePassportDetail;

  private final int REQUISITION_ID = 1;
  private final Long PASSPORT_DETAIL_ID = 100L;

  @BeforeEach
  void setUp() {
    baseRequisition = Requisition.builder()
      .id(REQUISITION_ID)
      .mnemonic("passport")
      .status(RequisitionStatus.FILED)
      .passportDetail(PassportDetail.builder().id(PASSPORT_DETAIL_ID).build())
      .build();

    basePassportDTO = PassportDTO.builder()
      .requisition(REQUISITION_ID)
      .passportNumber("AB123456")
      .issueDate(LocalDate.of(2025, 1, 1))
      .ownerPhone("+79998887766")
      .ownerEmail("test@example.com")
      .photoUrl("http://example.com/photo.jpg")
      .specialMarks("Особые отметки")
      .chipNumber("CHIP987")
      .build();

    basePassportDetail = PassportDetail.builder()
      .id(PASSPORT_DETAIL_ID)
      .passportNumber("AB123456")
      .ownerPhone("+79998887766")
      .ownerEmail("test@example.com")
      .status(true)
      .requisition(baseRequisition)
      .build();
  }

  @Test
  void getPassportWnenAllGood() {
    Requisition requisitionForInactive = Requisition.builder()
      .id(999)
      .mnemonic("passport")
      .status(RequisitionStatus.REJECTED)
      .build();

    PassportDetail inactivePassport = PassportDetail.builder()
      .id(2L)
      .passportNumber("CD456")
      .status(false)
      .requisition(requisitionForInactive)
      .build();

    when(catPassportRepository.findAll()).thenReturn(List.of(basePassportDetail, inactivePassport));

    List<PassportDTO> result = passportService.getPassports();

    assertThat(result).hasSize(1);
    PassportDTO dto = result.get(0);
    assertThat(dto.getPassportNumber()).isEqualTo("AB123456");
  }

  @Test
  void getPassportWnenRepoIsEmpty() {
    when(catPassportRepository.findAll()).thenReturn(List.of());
    List<PassportDTO> result = passportService.getPassports();
    assertThat(result).isEmpty();
  }

  @Test
  void addCatPassportWhenAllGood() {
    when(requisitionRepository.findById(REQUISITION_ID)).thenReturn(Optional.of(baseRequisition));
    when(catPassportRepository.save(any(PassportDetail.class))).thenAnswer(invocation -> {
      PassportDetail arg = invocation.getArgument(0);
      arg.setId(PASSPORT_DETAIL_ID);
      return arg;
    });

    PassportDTO resultDTO = passportService.addCatPassport(basePassportDTO);

    assertThat(resultDTO).isNotNull();
    assertThat(resultDTO.getId()).isEqualTo(PASSPORT_DETAIL_ID);
    assertThat(resultDTO).isSameAs(basePassportDTO);
  }

  @Test
  void addCatPassportWhenReqIsNull() {
    // Создаём DTO с requisition = null без использования toBuilder()
    PassportDTO dtoWithNullReq = PassportDTO.builder()
      .requisition(null)
      .passportNumber(basePassportDTO.getPassportNumber())
      .issueDate(basePassportDTO.getIssueDate())
      .ownerPhone(basePassportDTO.getOwnerPhone())
      .ownerEmail(basePassportDTO.getOwnerEmail())
      .photoUrl(basePassportDTO.getPhotoUrl())
      .specialMarks(basePassportDTO.getSpecialMarks())
      .chipNumber(basePassportDTO.getChipNumber())
      .build();

    when(catPassportRepository.save(any(PassportDetail.class))).thenAnswer(invocation -> {
      PassportDetail arg = invocation.getArgument(0);
      arg.setId(PASSPORT_DETAIL_ID);
      return arg;
    });

    PassportDTO resultDTO = passportService.addCatPassport(dtoWithNullReq);

    assertThat(resultDTO).isNotNull();
    assertThat(resultDTO.getId()).isEqualTo(PASSPORT_DETAIL_ID);
    assertThat(resultDTO).isSameAs(dtoWithNullReq);
  }

  @Test
  void addCatPassportWhenPassportNumberHadDuplicate() {
    when(catPassportRepository.existsByPassportNumber(basePassportDTO.getPassportNumber()))
      .thenReturn(false, true);

    when(catPassportRepository.save(any(PassportDetail.class))).thenAnswer(invocation -> {
      PassportDetail arg = invocation.getArgument(0);
      arg.setId(PASSPORT_DETAIL_ID);
      return arg;
    });

    // Первое добавление – успешно
    PassportDTO firstResult = passportService.addCatPassport(basePassportDTO);
    assertThat(firstResult).isNotNull();
    assertThat(firstResult.getId()).isEqualTo(PASSPORT_DETAIL_ID);

    // Второе добавление – дубликат (создаём новый объект без toBuilder)
    PassportDTO duplicateDTO = PassportDTO.builder()
      .requisition(basePassportDTO.getRequisition())
      .passportNumber(basePassportDTO.getPassportNumber()) // тот же номер
      .issueDate(basePassportDTO.getIssueDate())
      .ownerPhone("+79128587206")
      .ownerEmail("test1@example.com")
      .photoUrl("http://example1.com/photo1.jpg")
      .specialMarks("Особые отметки1")
      .chipNumber("CHIP9871")
      .build();

    assertThatThrownBy(() -> passportService.addCatPassport(duplicateDTO))
      .isInstanceOf(DuplicateEntityException.class);
  }
}
