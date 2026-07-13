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
import ru.practice.kotouslugi.model.DriverLicense;
import ru.practice.kotouslugi.model.enums.DriverLicenseStatus;
import ru.practice.kotouslugi.service.DriverLicenseService;

import java.util.List;

@RestController
@RequestMapping("/api/driver-license")
@Tag(name = "DriverLicenseController", description = "Методы для работы с заявками на водительские права")
public class DriverLicenseController extends BaseController {

    private final DriverLicenseService driverLicenseService;

    public DriverLicenseController(DriverLicenseService driverLicenseService) {
        this.driverLicenseService = driverLicenseService;
    }

    @PostMapping(value = "/create", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Подать заявку на водительские права", tags = {"Водительские права"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Ошибка валидации или занятый слот")}
    )
    public ResponseEntity<Integer> createApplication(@RequestBody DriverLicense driverLicense) {
        return wrapper((s) -> driverLicenseService.createApplication(driverLicense));
    }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список всех заявок", tags = {"Водительские права"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK")}
    )
    public List<DriverLicense> listApplications() {
        return driverLicenseService.listApplications();
    }

    @GetMapping(value = "/get", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить заявку по id", tags = {"Водительские права"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Заявка не найдена")}
    )
    public ResponseEntity<DriverLicense> getApplication(
            @Parameter(name = "id", required = true) @RequestParam Integer id) {
        return wrapper((s) -> driverLicenseService.getById(id));
    }

    @PostMapping(value = "/update-status", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Обновить статус заявки", tags = {"Водительские права"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Заявка не найдена")}
    )
    public ResponseEntity<Boolean> updateStatus(
            @Parameter(name = "id", required = true) @RequestParam Integer id,
            @Parameter(name = "status", required = true) @RequestParam DriverLicenseStatus status) {
        return wrapper((s) -> driverLicenseService.updateStatus(id, status));
    }
}
