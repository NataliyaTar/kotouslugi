package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.dao.DrivingSchoolRepository;
import ru.practice.kotouslugi.dao.LicenseCategoryRepository;
import ru.practice.kotouslugi.model.DrivingSchool;
import ru.practice.kotouslugi.model.LicenseCategory;

import java.util.LinkedList;
import java.util.List;

@RestController
@RequestMapping("/api/driving-school")
@Tag(name = "DrivingSchoolController", description = "Справочники для услуги водительских прав")
public class DrivingSchoolController {

    private final DrivingSchoolRepository drivingSchoolRepository;
    private final LicenseCategoryRepository licenseCategoryRepository;

    public DrivingSchoolController(DrivingSchoolRepository drivingSchoolRepository,
                                   LicenseCategoryRepository licenseCategoryRepository) {
        this.drivingSchoolRepository = drivingSchoolRepository;
        this.licenseCategoryRepository = licenseCategoryRepository;
    }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список автошкол с рейтингом", tags = {"Автошколы"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK")}
    )
    public List<DrivingSchool> listSchools() {
        List<DrivingSchool> result = new LinkedList<>();
        drivingSchoolRepository.findAll().forEach(result::add);
        return result;
    }

    @GetMapping(value = "/categories", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список категорий водительских прав", tags = {"Автошколы"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK")}
    )
    public List<LicenseCategory> listCategories() {
        List<LicenseCategory> result = new LinkedList<>();
        licenseCategoryRepository.findAll().forEach(result::add);
        return result;
    }
}
