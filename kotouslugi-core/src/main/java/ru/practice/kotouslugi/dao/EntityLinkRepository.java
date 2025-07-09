package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.EntityLink;

public interface EntityLinkRepository extends CrudRepository<EntityLink, Long> {

}
