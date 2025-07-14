package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.dto.CreateOrderRequest;
import ru.practice.kotouslugi.model.Order;
import ru.practice.kotouslugi.service.OrderService;
import ru.practice.kotouslugi.service.AuthService;
import ru.practice.kotouslugi.exception.ServiceException;

@RestController
@RequestMapping("/api/order")
@Tag(name = "OrderController", description = "Методы для работы с заказами еды котикам")
public class OrderController extends BaseController {
    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @PostMapping(value = "/create", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Создать заказ еды", tags = {"Заказы еды"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")})
    public ResponseEntity<Long> createOrder(@RequestBody CreateOrderRequest request, @Parameter(hidden = true) @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return wrapper((s) -> {
            Long userId = authService.getCurrentUserId(authHeader);
            return orderService.createOrder(request, userId);
        });
    }
} 