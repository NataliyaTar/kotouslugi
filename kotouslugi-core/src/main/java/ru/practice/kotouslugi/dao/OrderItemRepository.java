package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.OrderItem;

public interface OrderItemRepository extends CrudRepository<OrderItem, Long> {
} 