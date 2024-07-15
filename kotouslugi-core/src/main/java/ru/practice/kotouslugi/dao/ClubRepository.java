package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Club;

public interface ClubRepository extends CrudRepository<Club, Long> {

}
