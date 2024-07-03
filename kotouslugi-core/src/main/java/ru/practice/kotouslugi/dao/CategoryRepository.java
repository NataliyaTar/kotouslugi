package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Category;

public interface CategoryRepository extends CrudRepository<Category, Long> {
}
