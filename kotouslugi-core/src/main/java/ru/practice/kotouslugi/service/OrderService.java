package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.practice.kotouslugi.dao.OrderRepository;
import ru.practice.kotouslugi.dao.OrderItemRepository;
import ru.practice.kotouslugi.dao.ProductRepository;
import ru.practice.kotouslugi.dao.UserAddressRepository;
import ru.practice.kotouslugi.model.Order;
import ru.practice.kotouslugi.model.OrderItem;
import ru.practice.kotouslugi.model.Product;
import ru.practice.kotouslugi.model.UserAddress;
import ru.practice.kotouslugi.model.enums.OrderStatus;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserAddressRepository userAddressRepository;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository, ProductRepository productRepository, UserAddressRepository userAddressRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userAddressRepository = userAddressRepository;
    }

    @Transactional
    public Long createOrder(ru.practice.kotouslugi.dto.CreateOrderRequest request, Long userId) {
        // Сохраняем адрес
        UserAddress address = null;
        if (request.getAddress() != null) {
            ru.practice.kotouslugi.dto.UserAddressDto addrDto = request.getAddress();
            address = UserAddress.builder()
                    .city(addrDto.getCity())
                    .address(addrDto.getAddress())
                    .floor(addrDto.getFloor())
                    .apartment_number(addrDto.getApartment_number())
                    .build();
            address = userAddressRepository.save(address);
        }

        // Сохраняем заказ
        Order order = Order.builder()
                .cat_name(request.getCat_name())
                .user_name(request.getUser_name())
                .store_name(request.getStore_name())
                .delivery_type(request.getDelivery_type())
                .delivery_date(request.getDelivery_date())
                .delivery_time(request.getDelivery_time())
                .user_comment(request.getUser_comment())
                .status(OrderStatus.ACCEPTED)
                .address(address)
                .build();
        order = orderRepository.save(order);

        // Сохраняем товары заказа
        List<OrderItem> items = new ArrayList<>();
        if (request.getOrder_items() != null) {
            for (ru.practice.kotouslugi.dto.OrderItemDto itemDto : request.getOrder_items()) {
                Product product = productRepository.findById(itemDto.getProduct_id()).orElse(null);
                OrderItem item = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(itemDto.getQuantity())
                        .price(itemDto.getPrice())
                        .build();
                items.add(orderItemRepository.save(item));
            }
        }
        return order.getId();
    }
} 