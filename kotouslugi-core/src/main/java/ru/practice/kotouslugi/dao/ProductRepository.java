package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Product;

public interface ProductRepository extends CrudRepository<Product, Long> {
} 