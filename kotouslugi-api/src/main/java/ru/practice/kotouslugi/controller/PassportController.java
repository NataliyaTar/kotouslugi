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
import ru.practice.kotouslugi.model.dto.PassportDetailDto;
import ru.practice.kotouslugi.service.PassportService;

import java.util.List;

@RestController
@RequestMapping("/api/passport")
@Tag(name = "PassportController", description = "Единый реестр паспортов животных")
public class PassportController extends BaseController {
    private final PassportService passportService;

    public PassportController(PassportService passportService) {
        this.passportService = passportService;
    }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список паспортов животных", tags = {"Реестр паспортов"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<List<PassportDetailDto>> listPassports() {
        return wrapper((s) -> passportService.listPassports());
    }

    @GetMapping(value = "/get", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить паспорт по идентификатору", tags = {"Реестр паспортов"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<PassportDetailDto> getPassport(
            @Parameter(name = "id", required = true) @RequestParam Long id) {
        return wrapper((s) -> passportService.getPassport(id));
    }

    @GetMapping(value = "/byCat", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить паспорт по идентификатору кота", tags = {"Реестр паспортов"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<PassportDetailDto> getPassportByCat(
            @Parameter(name = "catId", required = true) @RequestParam Long catId) {
        return wrapper((s) -> passportService.getPassportByCatId(catId));
    }

    @GetMapping(value = "/search", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Поиск паспорта по номеру, чипу или кличке", tags = {"Реестр паспортов"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<List<PassportDetailDto>> searchPassports(
            @Parameter(name = "query", required = true) @RequestParam String query) {
        return wrapper((s) -> passportService.searchPassports(query));
    }
}
