package ru.practice.kotouslugi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.practice.kotouslugi.dao.MissingCatRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.MissingCatRequisition;

import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MissingCatService {
  private final MissingCatRepository missingCatRepository;
  private final ObjectMapper objectMapper = new ObjectMapper();

  public MissingCatService(MissingCatRepository missingCatRepository) {
    this.missingCatRepository = missingCatRepository;
  }

  public Integer createMissingCat(String data, Map<String, MultipartFile> fileMap) throws ServiceException {
    try {
      JsonNode root = objectMapper.readTree(data);
      JsonNode step0 = root.path("0");
      JsonNode step1 = root.path("1");
      JsonNode step2 = root.path("2");

      String photoNames = joinNames(fileMap, "photo_");
      String documentNames = joinNames(fileMap, "document_");

      MissingCatRequisition entity = MissingCatRequisition.builder()
        .catName(step0.path("catName").asText())
        .breed(step0.path("breed").asText())
        .color(step0.path("color").asText())
        .age(step0.path("age").asInt())
        .gender(step0.path("gender").asText())
        .distinctiveFeatures(step0.path("distinctiveFeatures").asText())
        .lastSeenDate(step1.path("lastSeenDate").asText())
        .lastSeenPlace(step1.path("lastSeenPlace").asText())
        .mapLocation(step1.path("mapLocation").asText())
        .phone(step1.path("phone").asText())
        .additionalInfo(step1.path("additionalInfo").asText())
        .status(step2.path("status").asText())
        .created(new Date())
        .photoNames(photoNames)
        .documentNames(documentNames)
        .build();

      return missingCatRepository.save(entity).getId();
    } catch (Exception e) {
      throw new ServiceException("Ошибка обработки заявки о пропавшем котике: " + e.getMessage());
    }
  }

  private String joinNames(Map<String, MultipartFile> fileMap, String prefix) {
    return fileMap.entrySet().stream()
      .filter(e -> e.getKey().startsWith(prefix))
      .map(e -> e.getValue().getOriginalFilename())
      .collect(Collectors.joining(", "));
  }
}
