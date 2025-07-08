package ru.practice.kotouslugi.service;

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
    /// билдится запись
    ForeignPassword foreignPassword = ForeignPassword.builder()
        .personalData(personalData)
        .metadata(Metadata.builder().build())
        .processingStatus(ProcessingStatus.builder().build())
        .build();

    /// сохраняется в БД
    foreignPasswordRepository.save(foreignPassword);

    ///  проверка на то, сохранилось ли в БД
    if (foreignPasswordRepository.existsById(foreignPassword.getId())) {
      System.out.println("создалось в БД");

    }

    return foreignPassword;
  }
}
