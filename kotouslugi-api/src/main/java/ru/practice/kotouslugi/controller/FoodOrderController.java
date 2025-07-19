package ru.practice.kotouslugi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.FoodOrder;
import ru.practice.kotouslugi.service.FoodOrderService;

@RestController
@RequestMapping("/api/food")
public class FoodOrderController {

  private final FoodOrderService foodOrderService;

  public FoodOrderController(FoodOrderService foodOrderService) {
    this.foodOrderService = foodOrderService;
  }

  @PostMapping("/order")
  public ResponseEntity<FoodOrder> createOrder(@RequestBody FoodOrder order) {
    FoodOrder savedOrder = foodOrderService.createOrder(order);
    return ResponseEntity.ok(savedOrder);
  }
}
