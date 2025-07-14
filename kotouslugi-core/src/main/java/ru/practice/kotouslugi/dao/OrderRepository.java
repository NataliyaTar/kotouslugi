package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;

import ru.practice.kotouslugi.model.Order;

public interface OrderRepository extends CrudRepository<Order, Long> {

} 