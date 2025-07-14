package ru.practice.kotouslugi.dto;

import lombok.Data;
import ru.practice.kotouslugi.model.enums.DeliveryType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateOrderRequest {
    private String cat_name;
    private String user_name;
    private String store_name;
    private DeliveryType delivery_type;
    private LocalDate delivery_date;
    private LocalDateTime delivery_time;
    private String user_comment;
    private List<OrderItemDto> order_items;
    private UserAddressDto address;
} 