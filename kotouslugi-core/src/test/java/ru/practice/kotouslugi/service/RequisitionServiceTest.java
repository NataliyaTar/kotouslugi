package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.practice.kotouslugi.dao.KotoServiceRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RequisitionServiceTest {

  @Mock
  private RequisitionRepository requisitionRepository;

  @Mock
  private KotoServiceRepository kotoServiceRepository;

  @InjectMocks
  private RequisitionService requisitionService;

  @Test
  void createRequisitionTest() {
    Requisition req = new Requisition();
    Requisition savedReq = new Requisition();
    savedReq.setId(123);
    when(requisitionRepository.save(any(Requisition.class))).thenReturn(savedReq);
    int id = requisitionService.createRequisition(req);
    assertEquals(123, id);
    assertEquals(RequisitionStatus.FILED, req.getStatus());
    assertNotNull(req.getCreated());
    verify(requisitionRepository, times(1)).save(req);
  }

  @Test
  void listRequisitionTest() {
    Requisition req = new Requisition();
    req.setMnemonic("TEST_SERVICE");
    when(requisitionRepository.findAll()).thenReturn(List.of(req));
    when(kotoServiceRepository.findTitleByServiceMnemonic("TEST_SERVICE")).thenReturn("Тестовая услуга");

    List<Requisition> result = requisitionService.listRequisition();

    assertEquals(1, result.size());
    assertEquals("Тестовая услуга", result.get(0).getName());
    verify(kotoServiceRepository).findTitleByServiceMnemonic("TEST_SERVICE");
  }

  @Test
  void updateRequisition_Success() throws ServiceException {
    Requisition req = new Requisition();
    req.setId(1);
    when(requisitionRepository.findById(1)).thenReturn(Optional.of(req));
    Boolean result = requisitionService.updateRequisition(req);
    assertTrue(result);
    verify(requisitionRepository).save(req);
  }

  @Test
  void updateRequisition_ShouldThrowException_WhenIdIsNull() {
    Requisition req = new Requisition();
    assertThrows(ServiceException.class, () -> {
      requisitionService.updateRequisition(req);
    });
  }

  @Test
  void updateRequisition_ShouldThrowException_WhenNotFound() {
    Requisition req = new Requisition();
    req.setId(999);
    when(requisitionRepository.findById(999)).thenReturn(Optional.empty());
    assertThrows(ServiceException.class, () -> {
      requisitionService.updateRequisition(req);
    });
  }
}
