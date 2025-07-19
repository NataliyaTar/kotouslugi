package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.practice.kotouslugi.model.FoodOrder;

public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {
}
