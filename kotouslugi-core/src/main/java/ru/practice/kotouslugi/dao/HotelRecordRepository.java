package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.HotelRecord;

public interface HotelRecordRepository extends CrudRepository<HotelRecord, Long> {
}
