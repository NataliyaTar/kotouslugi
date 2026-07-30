package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.practice.kotouslugi.dao.ExhibitionRepository;
import ru.practice.kotouslugi.dao.ReviewRepository;
import ru.practice.kotouslugi.model.Exhibition;
import ru.practice.kotouslugi.model.Review;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExhibitionServiceTest {

  @Mock
  private ExhibitionRepository exhibitionRepository;

  @Mock
  private ReviewRepository reviewRepository;

  @InjectMocks
  private ExhibitionService exhibitionService;

  @Test
  void getExhibitionsTest() {
    Exhibition ex = new Exhibition();
    ex.setName("Кото-фест");
    when(exhibitionRepository.findAll()).thenReturn(List.of(ex));

    List<Exhibition> result = exhibitionService.getExhibitions();

    assertFalse(result.isEmpty());
    assertEquals("Кото-фест", result.get(0).getName());
    verify(exhibitionRepository).findAll();
  }

  @Test
  void saveReviewTest() {
    Review review = new Review();
    review.setExhibitionId(1);
    when(reviewRepository.save(any())).thenReturn(review);

    Review saved = exhibitionService.saveReview(review);

    assertNotNull(saved);
    assertEquals(1, saved.getExhibitionId());
    verify(reviewRepository).save(review);
  }
}
