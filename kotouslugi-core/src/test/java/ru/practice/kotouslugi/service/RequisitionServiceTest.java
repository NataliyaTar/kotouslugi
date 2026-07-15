package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.KotoServiceRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RequisitionServiceTest {

  private RequisitionRepository requisitionRepository;
  private KotoServiceRepository kotoServiceRepository;
  private EntertainmentBookingService entertainmentBookingService;
  private RequisitionService requisitionService;

  @BeforeEach
  void setUp() {
    requisitionRepository = mock(RequisitionRepository.class);
    kotoServiceRepository = mock(KotoServiceRepository.class);
    entertainmentBookingService = mock(EntertainmentBookingService.class);
    requisitionService = new RequisitionService(
      requisitionRepository, kotoServiceRepository, entertainmentBookingService);
  }

  @Test
  void createRequisition_shouldCallBookingService_whenMnemonicIsEntertainment() throws ServiceException {
    Requisition requisition = Requisition.builder()
      .mnemonic("entertainment")
      .fields("[{\"eventId\":0,\"visitDatetime\":\"2026-08-08T10:00:00\"}]")
      .build();
    when(entertainmentBookingService.supports("entertainment")).thenReturn(true);
    when(requisitionRepository.save(any(Requisition.class))).thenAnswer(inv -> inv.getArgument(0));

    int id = requisitionService.createRequisition(requisition);

    verify(entertainmentBookingService).registerAppointment(requisition.getFields());
    assertThat(requisition.getStatus()).isEqualTo(RequisitionStatus.FILED);
    assertThat(requisition.getCreated()).isNotNull();
    assertThat(id).isEqualTo(requisition.getId());
  }

  @Test
  void createRequisition_shouldSkipBookingService_whenMnemonicIsNotEntertainment() throws ServiceException {
    Requisition requisition = Requisition.builder()
      .mnemonic("vet")
      .fields("[{\"doctor\":0}]")
      .build();
    when(entertainmentBookingService.supports("vet")).thenReturn(false);
    when(requisitionRepository.save(any(Requisition.class))).thenAnswer(inv -> inv.getArgument(0));

    requisitionService.createRequisition(requisition);

    verify(entertainmentBookingService, never()).registerAppointment(any());
  }

  @Test
  void createRequisition_shouldPropagateException_whenBookingServiceFails() throws ServiceException {
    Requisition requisition = Requisition.builder()
      .mnemonic("entertainment")
      .fields("[{\"eventId\":999}]")
      .build();
    when(entertainmentBookingService.supports("entertainment")).thenReturn(true);
    org.mockito.Mockito.doThrow(new ServiceException("Выбранное мероприятие не найдено"))
      .when(entertainmentBookingService).registerAppointment(requisition.getFields());

    assertThatThrownBy(() -> requisitionService.createRequisition(requisition))
      .isInstanceOf(ServiceException.class)
      .hasMessageContaining("не найдено");

    verify(requisitionRepository, never()).save(any());
  }

  @Test
  void listRequisition_shouldFillNameFromKotoService() {
    Requisition requisition = Requisition.builder().id(1).mnemonic("entertainment").build();
    when(requisitionRepository.findAll()).thenReturn(List.of(requisition));
    when(kotoServiceRepository.findTitleByServiceMnemonic("entertainment")).thenReturn("Культурный досуг");

    List<Requisition> result = requisitionService.listRequisition();

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getName()).isEqualTo("Культурный досуг");
  }

  @Test
  void updateRequisition_shouldThrow_whenRequisitionNotFound() {
    Requisition requisition = Requisition.builder().id(42).build();
    when(requisitionRepository.findById(42)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> requisitionService.updateRequisition(requisition))
      .isInstanceOf(ServiceException.class)
      .hasMessageContaining("не найдена");
  }

  @Test
  void updateRequisition_shouldSave_whenRequisitionExists() throws ServiceException {
    Requisition requisition = Requisition.builder().id(1).mnemonic("entertainment").build();
    when(requisitionRepository.findById(1)).thenReturn(Optional.of(requisition));

    Boolean result = requisitionService.updateRequisition(requisition);

    assertThat(result).isTrue();
    verify(requisitionRepository).save(requisition);
  }
}
