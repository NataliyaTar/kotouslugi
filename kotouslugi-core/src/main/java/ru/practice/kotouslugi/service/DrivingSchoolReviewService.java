package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.DrivingSchoolRepository;
import ru.practice.kotouslugi.dao.SchoolReviewRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.DrivingSchool;
import ru.practice.kotouslugi.model.SchoolReview;

import java.util.LinkedList;
import java.util.List;

@Service
public class DrivingSchoolReviewService {

    private final SchoolReviewRepository reviewRepository;
    private final DrivingSchoolRepository drivingSchoolRepository;

    public DrivingSchoolReviewService(SchoolReviewRepository reviewRepository,
                                      DrivingSchoolRepository drivingSchoolRepository) {
        this.reviewRepository = reviewRepository;
        this.drivingSchoolRepository = drivingSchoolRepository;
    }

    public Integer saveReview(SchoolReview review) throws ServiceException {
        validateReview(review);
        checkExistingReview(review.getCat().getId(), review.getSchoolName());
        Integer id = reviewRepository.save(review).getId();
        recalculateSchoolRating(review.getSchoolName());
        return id;
    }

    public void validateReview(SchoolReview review) throws ServiceException {
        if (review.getSchoolRating() == null || review.getSchoolRating() < 1 || review.getSchoolRating() > 5)
            throw new ServiceException("Оценка должна быть от 1 до 5");
        if (review.getComment() == null || review.getComment().isBlank())
            throw new ServiceException("Комментарий не может быть пустым");
        if (review.getSchoolName() == null || review.getSchoolName().isBlank())
            throw new ServiceException("Не указано название автошколы");
        if (review.getCat() == null || review.getCat().getId() == null)
            throw new ServiceException("Не указан кот");
    }

    public void checkExistingReview(Long catId, String schoolName) throws ServiceException {
        if (reviewRepository.existsByCatAndSchool(catId, schoolName))
            throw new ServiceException("Вы уже оставляли отзыв об этой автошколе");
    }

    public void recalculateSchoolRating(String schoolName) {
        List<SchoolReview> reviews = reviewRepository.findBySchool(schoolName);
        if (reviews.isEmpty()) return;
        double avg = reviews.stream()
                .mapToInt(SchoolReview::getSchoolRating)
                .average()
                .orElse(0.0);
        DrivingSchool school = drivingSchoolRepository.findByName(schoolName);
        if (school != null) {
            school.setOverallRating(Math.round(avg * 10.0) / 10.0);
            drivingSchoolRepository.save(school);
        }
    }

    public List<SchoolReview> listReviews() {
        List<SchoolReview> result = new LinkedList<>();
        reviewRepository.findAll().forEach(result::add);
        return result;
    }

    public List<SchoolReview> getReviewsBySchool(String schoolName) {
        return reviewRepository.findBySchool(schoolName);
    }
}
