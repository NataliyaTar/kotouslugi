package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.Category;
import ru.practice.kotouslugi.model.KotoServiceEntity;
import ru.practice.kotouslugi.service.KotoService;

import java.util.List;

import static ru.practice.kotouslugi.request.RequestId.asRequestId;

@RestController
@RequestMapping("/api")
@Tag(name = "ProductServiceController", description = "Методы для работы с АПИ котоуслуг")
public class ProductServiceController extends BaseController {
    private final KotoService kotoService;

    public ProductServiceController(KotoService kotoService) {
      this.kotoService = kotoService;
    }

    @GetMapping(value = "test/hello", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Поздороваться с сервисом", tags = {"Тестовые запросы"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<String> hello() {
        return wrapper((s) -> "hello test!!");
    }

    @GetMapping(value = "test/exception", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Поймать ошибку", tags = {"Тестовые запросы"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<String> testException() {
        return wrapper((s) -> {
            throw new ServiceException("test exception!");
        });
    }

    @GetMapping(value = "/service/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список сервисов котоуслуг", tags = {"Котоуслуги"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<List<KotoServiceEntity>> listService() {
        return wrapper((s) -> kotoService.listServices());
    }

    @GetMapping(value = "/service/byId/{id}", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить сервис котоуслуг по идентификатору", tags = {"Котоуслуги"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<KotoServiceEntity> getServiceById(
      @Parameter(name = "requestId", required = true) @PathVariable Integer id) {
        return wrapper((s) -> kotoService.getServiceById(asRequestId(id)));
    }

    @GetMapping(value = "/service/categories", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список категорий", tags = {"Котоуслуги"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<List<Category>> listCategories() {
        return wrapper((s) -> kotoService.listCategories());
    }
}
