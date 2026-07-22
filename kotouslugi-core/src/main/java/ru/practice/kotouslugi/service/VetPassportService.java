package ru.practice.kotouslugi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.practice.kotouslugi.dao.VetPassportRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.VetPassport;

import java.util.Date;

@Service
public class VetPassportService {
  private final VetPassportRepository vetPassportRepository;
  private final ObjectMapper objectMapper = new ObjectMapper();

  public VetPassportService(VetPassportRepository vetPassportRepository) {
    this.vetPassportRepository = vetPassportRepository;
  }

  public Integer createVetPassport(String data, MultipartFile photo) throws ServiceException {
    try {
      JsonNode root = objectMapper.readTree(data);
      JsonNode step0 = root.path("0");
      JsonNode step1 = root.path("1");
      JsonNode step2 = root.path("2");
      JsonNode vaccinations = root.path("vaccinations");

      VetPassport entity = VetPassport.builder()
        .petName(step0.path("petName").asText())
        .breed(step0.path("breed").asText())
        .age(step0.path("age").asInt())
        .gender(step0.path("gender").asText())
        .chipNumber(step1.path("chipNumber").asText())
        .chipDate(step1.path("chipDate").asText())
        .chipClinic(step1.path("chipClinic").asText())
        .notes(step2.path("notes").asText())
        .vaccinationsJson(vaccinations.toString())
        .qrCodeGenerated(root.path("qrCodeGenerated").asBoolean(false))
        .created(new Date())
        .photoName(photo != null ? photo.getOriginalFilename() : null)
        .build();

      return vetPassportRepository.save(entity).getId();
    } catch (Exception e) {
      throw new ServiceException("Ошибка обработки ветеринарного паспорта: " + e.getMessage());
    }
  }
}
