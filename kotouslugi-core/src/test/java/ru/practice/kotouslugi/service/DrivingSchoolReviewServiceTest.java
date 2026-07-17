package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.DrivingSchoolRepository;
import ru.practice.kotouslugi.dao.SchoolReviewRepository;
import ru.practice.kotouslugi.model.Cat;
import ru.practice.kotouslugi.model.SchoolReview;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DrivingSchoolReviewServiceTest {

    private SchoolReviewRepository reviewRepository;
    private DrivingSchoolReviewService drivingSchoolReviewService;

    @BeforeEach
    void setUp() {
        reviewRepository = mock(SchoolReviewRepository.class);
        DrivingSchoolRepository drivingSchoolRepository = mock(DrivingSchoolRepository.class);
        drivingSchoolReviewService = new DrivingSchoolReviewService(reviewRepository, drivingSchoolRepository);
    }

    @Test
    void shouldListReviews() {
        Cat cat = Cat.builder().id(1L).name("Мурзик").build();
        when(reviewRepository.findAll()).thenReturn(
            () -> List.of(SchoolReview.builder()
                .id(1)
                .cat(cat)
                .schoolName("КотоАвтошкола")
                .schoolRating(5)
                .comment("Отличная автошкола!")
                .build()).iterator()
        );

        drivingSchoolReviewService.listReviews();

        verify(reviewRepository).findAll();
    }
}
