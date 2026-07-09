package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
}
