package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.EventEntity;

import java.util.List;

public interface EventRepository extends CrudRepository<EventEntity, Integer> {

  List<EventEntity> findByVenueId(int venueId);
}
