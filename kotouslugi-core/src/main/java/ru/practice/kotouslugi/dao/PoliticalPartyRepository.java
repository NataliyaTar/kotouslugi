package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.PoliticalParty;

import java.util.Optional;

@Repository
public interface PoliticalPartyRepository extends CrudRepository<PoliticalParty, Long> {
    boolean existsByName(String name);

    boolean existsByCandidateCatId(Long id);

    Optional<PoliticalParty> findByName(String name);
}
