package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CategoryRepository;
import ru.practice.kotouslugi.dao.KotoServiceRepository;
import ru.practice.kotouslugi.model.Category;
import ru.practice.kotouslugi.model.KotoServiceEntity;
import ru.practice.kotouslugi.request.RequestId;

import java.util.LinkedList;
import java.util.List;

@Service
public class KotoServiceTest {
    private final KotoServiceRepository kotoServiceRepository;
    private final CategoryRepository categoryRepository;

  public KotoServiceTest(KotoServiceRepository kotoServiceRepository, CategoryRepository categoryRepository) {
    this.kotoServiceRepository = kotoServiceRepository;
    this.categoryRepository = categoryRepository;
  }

  /**
     * Получение списка всех сервисов
     *
     * @return - список сервисов
     */
    public List<KotoServiceEntity> listServices() {
        List<KotoServiceEntity> entityList = new LinkedList<>();
        Iterable<KotoServiceEntity> serviceEntities = kotoServiceRepository.findAll();
        serviceEntities.forEach(entityList::add);
        return entityList;
    }

    /**
     * Получение сервиса по его id
     *
     * @param request - запрос с id сервиса
     * @return искомый сервис
     */
    public KotoServiceEntity getServiceById(RequestId request) {
        KotoServiceEntity result = null;
        KotoServiceEntity serviceEntity = kotoServiceRepository.findByServiceId(request.getId());
        if (serviceEntity != null)
            result = serviceEntity;
        return result;
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
