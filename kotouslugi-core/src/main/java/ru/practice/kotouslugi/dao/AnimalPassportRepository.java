package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.AnimalPassport;

import java.util.List;
import java.util.Optional;

public interface AnimalPassportRepository extends CrudRepository<AnimalPassport, Long> {
    Optional<AnimalPassport> findByCatId(Long catId);

    List<AnimalPassport> findAll();

    @Query("""
            SELECT p FROM AnimalPassport p
            WHERE (:passportId IS NOT NULL AND p.id = :passportId)
               OR LOWER(p.chipNumber) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    List<AnimalPassport> search(@Param("query") String query, @Param("passportId") Long passportId);
}
