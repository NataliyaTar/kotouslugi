package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.Exhibition;

@Repository
public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {
}
