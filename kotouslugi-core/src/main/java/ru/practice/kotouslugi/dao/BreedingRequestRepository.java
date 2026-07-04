package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.BreedingRequest;

@Repository
public interface BreedingRequestRepository extends JpaRepository<BreedingRequest, Long> {
}
