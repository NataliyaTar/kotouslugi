package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.FoodOrder;
import ru.practice.kotouslugi.service.FoodOrderService;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class FoodOrderControllerTest {
  private MockMvc mockMvc;
  private FoodOrderService foodOrderService;
  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    foodOrderService = mock(FoodOrderService.class);
    FoodOrderController controller = new FoodOrderController(foodOrderService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  @Test
  void shouldCreateFoodOrder() throws Exception {
    FoodOrder order = getTestOrder();
    FoodOrder savedOrder = getTestOrder();
    savedOrder.setId(1L);
    savedOrder.setStatus("Подана");

    doReturn(savedOrder).when(foodOrderService).createOrder(any(FoodOrder.class));

    mockMvc.perform(post("/api/food/order")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(order)))
      .andDo(print())
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.id").value(1L))
      .andExpect(jsonPath("$.status").value("Подана"));

    verify(foodOrderService).createOrder(any(FoodOrder.class));
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
