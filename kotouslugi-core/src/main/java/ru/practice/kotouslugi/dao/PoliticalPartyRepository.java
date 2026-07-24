package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.PoliticalParty;

@Repository
public interface PoliticalPartyRepository extends CrudRepository<PoliticalParty, Long> {

}
