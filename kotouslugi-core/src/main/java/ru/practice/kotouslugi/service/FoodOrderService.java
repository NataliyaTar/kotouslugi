package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.FoodOrderRepository;
import ru.practice.kotouslugi.model.FoodOrder;

@Service
public class FoodOrderService {

  private final FoodOrderRepository foodOrderRepository;

  public FoodOrderService(FoodOrderRepository foodOrderRepository) {
    this.foodOrderRepository = foodOrderRepository;
  }

  public FoodOrder createOrder(FoodOrder order) {
    order.setStatus("Подана");
    return foodOrderRepository.save(order);
  }
}
