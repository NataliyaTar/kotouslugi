package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.ExhibitionRepository;
import ru.practice.kotouslugi.dao.ReviewRepository;
import ru.practice.kotouslugi.model.Exhibition;
import ru.practice.kotouslugi.model.Review;

import java.util.List;

@Service
public class ExhibitionService {
  private final ExhibitionRepository exhibitionRepository;
  private final ReviewRepository reviewRepository;

  public ExhibitionService(ExhibitionRepository exhibitionRepository,
                           ReviewRepository reviewRepository) {
    this.exhibitionRepository = exhibitionRepository;
    this.reviewRepository = reviewRepository;
  }

  public List<Exhibition> getExhibitions() {
    return exhibitionRepository.findAll();
  }

  public Review saveReview(Review review) {
    return reviewRepository.save(review);
  }
  public Exhibition saveExhibition(Exhibition exhibition) {
    return exhibitionRepository.save(exhibition);
  }
}
