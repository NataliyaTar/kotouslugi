package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.UserAddress;

public interface UserAddressRepository extends CrudRepository<UserAddress, Long> {
} 