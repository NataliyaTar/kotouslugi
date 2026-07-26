package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.SchoolReview;

import java.util.List;

public interface SchoolReviewRepository extends CrudRepository<SchoolReview, Integer> {
    @Query("select count(sr) > 0 from SchoolReview sr where sr.cat.id = :catId and sr.schoolName = :schoolName")
    boolean existsByCatAndSchool(@Param("catId") Long catId, @Param("schoolName") String schoolName);

    @Query("from SchoolReview sr where sr.schoolName = :schoolName")
    List<SchoolReview> findBySchool(@Param("schoolName") String schoolName);
}
