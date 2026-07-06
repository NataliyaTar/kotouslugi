package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.Manufacturer;
import ru.practice.kotouslugi.model.dto.DrugVerificationResult;
import ru.practice.kotouslugi.service.DrugRegistryService;

import java.util.List;

@RestController
@RequestMapping("/api/drug")
@Tag(name = "DrugRegistryController", description = "Единый реестр ветеринарных препаратов")
public class DrugRegistryController extends BaseController {
    private final DrugRegistryService drugRegistryService;

    public DrugRegistryController(DrugRegistryService drugRegistryService) {
        this.drugRegistryService = drugRegistryService;
    }

    @GetMapping(value = "/verify", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Проверить подлинность препарата по коду партии", tags = {"Реестр препаратов"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<DrugVerificationResult> verifyBatch(
            @Parameter(name = "batchCode", required = true) @RequestParam String batchCode) {
        return wrapper((s) -> drugRegistryService.verifyBatch(batchCode));
    }

    @GetMapping(value = "/manufacturers", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список зарегистрированных производителей и импортёров", tags = {"Реестр препаратов"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<List<Manufacturer>> listManufacturers() {
        return wrapper((s) -> drugRegistryService.listManufacturers());
    }
}
