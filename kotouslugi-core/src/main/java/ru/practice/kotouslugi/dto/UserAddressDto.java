package ru.practice.kotouslugi.dto;

import lombok.Data;

@Data
public class UserAddressDto {
    private String city;
    private String address;
    private Integer floor;
    private Integer apartment_number;
} 