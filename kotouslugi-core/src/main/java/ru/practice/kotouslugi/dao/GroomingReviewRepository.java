package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.GroomingReview;

import java.util.List;

public interface GroomingReviewRepository extends CrudRepository<GroomingReview, Long> {
    List<GroomingReview> findBySalonId(Long salonId);
}
