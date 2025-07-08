package ru.practice.kotouslugi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.ForeignPasswordRepository;
import ru.practice.kotouslugi.model.FP.ForeignPassword;
import ru.practice.kotouslugi.model.FP.PersonalData;
import ru.practice.kotouslugi.model.FP.ProcessingStatus;
import ru.practice.kotouslugi.model.FP.Metadata;

@Service
public class ForeignPasswordService {
  private final ForeignPasswordRepository foreignPasswordRepository;

  public ForeignPasswordService(ForeignPasswordRepository foreignPasswordRepository) {
    this.foreignPasswordRepository = foreignPasswordRepository;
  }

  public ForeignPassword addParam(PersonalData personalData) {
    ForeignPassword foreignPassword = ForeignPassword.builder()
      .personalData(personalData)
      .metadata(Metadata.builder().build())       // Автоинициализация metadata
      .processingStatus(ProcessingStatus.builder().build())  // Автоинициализация processingStatus
      .build();
    foreignPasswordRepository.save(foreignPassword);
    return foreignPassword;
  }
}
