package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.FoodOrderRepository;
import ru.practice.kotouslugi.model.FoodOrder;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class FoodOrderServiceTest {
  private FoodOrderRepository foodOrderRepository;
  private FoodOrderService foodOrderService;

  @BeforeEach
  void setUp() {
    foodOrderRepository = mock(FoodOrderRepository.class);
    foodOrderService = new FoodOrderService(foodOrderRepository);
  }

  @Test
  void shouldCreateFoodOrder() {
    FoodOrder order = getTestOrder();
    FoodOrder savedOrder = getTestOrder();
    savedOrder.setId(1L);
    savedOrder.setStatus("Подана");

    when(foodOrderRepository.save(any(FoodOrder.class))).thenReturn(savedOrder);

    FoodOrder result = foodOrderService.createOrder(order);

    assertThat(result.getId()).isEqualTo(1L);
    assertThat(result.getStatus()).isEqualTo("Подана");
    verify(foodOrderRepository).save(any(FoodOrder.class));
  }

  private FoodOrder getTestOrder() {
    FoodOrder order = new FoodOrder();
    order.setCatId(2L);
    order.setOwnerName("Олег");
    order.setTelephone("+79998887766");
    order.setEmail("hello@mail.ru");
    order.setCity("Воронеж");
    order.setStreet("Хользунова");
    order.setHouse("2");
    order.setApartment("3");
    order.setShopId(3L);
    order.setDeliveryDate(LocalDate.of(2025, 9, 1));
    order.setDeliveryTime(LocalTime.of(14, 0));
    order.setComment("Не звонить");
    return order;
  }
}
