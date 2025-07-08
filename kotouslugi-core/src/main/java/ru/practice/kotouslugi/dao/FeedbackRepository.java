package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Feedback;

public interface FeedbackRepository extends CrudRepository<Feedback, Long> {
}
