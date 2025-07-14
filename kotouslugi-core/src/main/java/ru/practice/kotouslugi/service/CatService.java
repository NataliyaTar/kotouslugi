package ru.practice.kotouslugi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CatRepository;
import ru.practice.kotouslugi.model.Cat;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class CatService {
    private final CatRepository catRepository;
    private static final Logger logger = LoggerFactory.getLogger(CatService.class);

    public CatService(CatRepository catRepository) {
      this.catRepository = catRepository;
    }

    public List<Cat> listCat() {
        List<Cat> list = new LinkedList<>();
        Iterable<Cat> all = catRepository.findAll();
        all.forEach(list::add);
        return list;
    }

    public Long addCat(Cat cat) {
        try {
            cat = catRepository.save(cat);
            logger.info(String.format("Добавлен кот = %s ", cat.getCatName()));
            return cat.getCatId();
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }
    }

    public Cat getCat(Long id) {
        Optional<Cat> cat = catRepository.findById(id);
        return cat.orElse(null);
    }

    public void deleteCat(Long id) {
        Optional<Cat> cat = catRepository.findById(id);
        cat.ifPresent(catRepository::delete);
    }
}
