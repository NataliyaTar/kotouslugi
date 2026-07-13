package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.SchoolReview;
import ru.practice.kotouslugi.service.DrivingSchoolReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/school-review")
@Tag(name = "DrivingSchoolReviewController", description = "Методы для работы с отзывами об автошколах")
public class DrivingSchoolReviewController extends BaseController {

    private final DrivingSchoolReviewService drivingSchoolReviewService;

    public DrivingSchoolReviewController(DrivingSchoolReviewService drivingSchoolReviewService) {
        this.drivingSchoolReviewService = drivingSchoolReviewService;
    }

    @PostMapping(value = "/create", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Оставить отзыв об автошколе", tags = {"Отзывы"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Ошибка валидации или повторный отзыв")}
    )
    public ResponseEntity<Integer> createReview(@RequestBody SchoolReview review) {
        return wrapper((s) -> drivingSchoolReviewService.saveReview(review));
    }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список всех отзывов", tags = {"Отзывы"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK")}
    )
    public List<SchoolReview> listReviews() {
        return drivingSchoolReviewService.listReviews();
    }

    @GetMapping(value = "/by-school", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Отзывы по названию автошколы", tags = {"Отзывы"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK")}
    )
    public List<SchoolReview> getReviewsBySchool(
            @Parameter(name = "schoolName", required = true) @RequestParam String schoolName) {
        return drivingSchoolReviewService.getReviewsBySchool(schoolName);
    }
}
