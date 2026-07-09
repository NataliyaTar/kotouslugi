package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.ExhibitionRepository;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.dao.ReviewRepository;
import ru.practice.kotouslugi.model.Exhibition;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.Review;

import java.util.List;

@Service
public class ExhibitionService {
  private final ExhibitionRepository exhibitionRepository;
  private final RequisitionRepository requisitionRepository;
  private final ReviewRepository reviewRepository;

  public ExhibitionService(ExhibitionRepository exhibitionRepository,
                           RequisitionRepository requisitionRepository,
                           ReviewRepository reviewRepository) {
    this.exhibitionRepository = exhibitionRepository;
    this.requisitionRepository = requisitionRepository;
    this.reviewRepository = reviewRepository;
  }

  public List<Exhibition> getExhibitions() {
    return exhibitionRepository.findAll();
  }

  public Requisition saveRequisition(Requisition requisition) {
    return requisitionRepository.save(requisition);
  }

  public Review saveReview(Review review) {
    return reviewRepository.save(review);
  }
}
