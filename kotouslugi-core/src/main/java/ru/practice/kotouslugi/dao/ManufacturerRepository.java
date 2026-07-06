package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Manufacturer;

public interface ManufacturerRepository extends CrudRepository<Manufacturer, Long> {
}
