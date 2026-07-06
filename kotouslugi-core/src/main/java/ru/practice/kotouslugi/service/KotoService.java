package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.practice.kotouslugi.dao.CategoryRepository;
import ru.practice.kotouslugi.dao.KotoServiceRepository;
import ru.practice.kotouslugi.model.Category;
import ru.practice.kotouslugi.model.KotoServiceEntity;
import ru.practice.kotouslugi.request.RequestId;

import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
public class KotoService {
    private static final Map<String, Integer> SERVICE_ORDER = Map.of(
            "animal_passport", 0,
            "grooming_booking", 1,
            "vet", 2,
            "spa", 3,
            "new_family", 4
    );

    private final KotoServiceRepository kotoServiceRepository;
    private final CategoryRepository categoryRepository;

  public KotoService(KotoServiceRepository kotoServiceRepository, CategoryRepository categoryRepository) {
    this.kotoServiceRepository = kotoServiceRepository;
    this.categoryRepository = categoryRepository;
  }

  /**
     * Получение списка всех сервисов
     *
     * @return - список сервисов
     */
    @Transactional(readOnly = true)
    public List<KotoServiceEntity> listServices() {
        return kotoServiceRepository.findAllWithCategories().stream()
                .sorted(Comparator.comparingInt(s -> SERVICE_ORDER.getOrDefault(s.getMnemonic(), 99)))
                .toList();
    }

    /**
     * Получение сервиса по его id
     *
     * @param request - запрос с id сервиса
     * @return искомый сервис
     */
    @Transactional(readOnly = true)
    public KotoServiceEntity getServiceById(RequestId request) {
        return kotoServiceRepository.findByServiceIdWithCategories(request.getId());
    }

    /**
     * получение списка категорий
     *
     * @return список категорий
     */
    public List<Category> listCategories() {
        List<Category> result = new LinkedList<>();
        Iterable<Category> categories = categoryRepository.findAll();
        categories.forEach(result::add);
        return result;
    }
}
