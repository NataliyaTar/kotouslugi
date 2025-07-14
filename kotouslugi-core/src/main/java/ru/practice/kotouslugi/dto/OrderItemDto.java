package ru.practice.kotouslugi.dto;

import lombok.Data;

@Data
public class OrderItemDto {
    private Long product_id;
    private Integer quantity;
    private Double price;
} 