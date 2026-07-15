package ru.practice.kotouslugi.service;


import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.model.DecisionPassportDTO;
import ru.practice.kotouslugi.model.Requisition;

import java.util.List;

//в качестве демонстрации работы реальных сотрудников, будет происходить каждые 2 минуты подтверждение заявок на паспорт
@RequiredArgsConstructor
@Service
public class PollingService {

  private final RequisitionRepository requisitionRepository;
  private final CatPassportService catPassportService;

  @Scheduled(fixedDelay = 120_000)
  public void approveReq2min(){
    List<Requisition> requisitionList = requisitionRepository.findAll();

    if (!requisitionList.isEmpty()){
      for (Requisition req : requisitionList){
        DecisionPassportDTO decisionPassportDTO = new DecisionPassportDTO(req.getId());
        catPassportService.approvePassport(decisionPassportDTO);
      }
    }
  }
}
