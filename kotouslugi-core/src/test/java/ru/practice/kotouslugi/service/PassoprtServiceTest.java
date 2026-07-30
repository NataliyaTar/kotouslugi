package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.Assertions.assertThat;
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
  private  DecisionPassportService decisionPassportService;
  @InjectMocks
  private CatPassportService passportService;

  @Test
  void getPassportWnenAllGood(){
    Long passportDetailId = 1L;
    int requisitionId = 999;

    Requisition requisition = Requisition.builder()
      .id(requisitionId)  // любой id
      .mnemonic("passport")
      .status(RequisitionStatus.DONE)
      .build();

    Requisition requisitionForInactivePassport = Requisition.builder()
      .id(requisitionId)  // любой id
      .mnemonic("passport")
      .status(RequisitionStatus.REJECTED)
      .build();

    PassportDetail activePassport = PassportDetail.builder()
      .id(passportDetailId)
      .passportNumber("AB123")
      .ownerPhone("+79998887766")
      .ownerEmail("test@example.com")
      .status(true)
      .requisition(requisition)
      .build();

    PassportDetail inactivePassport = PassportDetail.builder()
      .id(2L)
      .passportNumber("CD456")
      .status(false)
      .requisition(requisitionForInactivePassport)
      .build();

    when(catPassportRepository.findAll()).thenReturn(List.of(activePassport, inactivePassport));

    List<PassportDTO> result = passportService.getPassports();

    assertThat(result).hasSize(1);
    PassportDTO dto = result.get(0);
    assertThat(dto.getPassportNumber()).isEqualTo("AB123");
  }
  @Test
  void getPassportWnenRepoIsEmpty(){
    when(catPassportRepository.findAll()).thenReturn(List.of()); // пустой список
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
      .isInstanceOf(DuplicateEntityException.class);

  }
}
