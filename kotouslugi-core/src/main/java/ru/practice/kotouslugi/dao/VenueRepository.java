package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Venue;

public interface VenueRepository extends CrudRepository<Venue, Integer> {
}
