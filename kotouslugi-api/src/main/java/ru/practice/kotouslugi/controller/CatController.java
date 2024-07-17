package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.Cat;
import ru.practice.kotouslugi.service.CatService;

import java.util.List;

@RestController
@RequestMapping("/api/cat")
@Tag(name = "CatController", description = "Методы для работы с АПИ пользователей")
public class CatController extends BaseController {
    private final CatService catService;

    public CatController(CatService catService) {
    this.catService = catService;
  }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список котов", tags = {"Кошачье АПИ"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Cat> listCat() {
      return catService.listCat();
    }

    @PostMapping(value = "/add", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Добавить кота", tags = {"Кошачье АПИ"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Long> addCat(@RequestBody Cat cat) {
        return wrapper((s) -> catService.addCat(cat));
    }

    @GetMapping(value = "/get", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить кота по идентификатору", tags = {"Кошачье АПИ"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Cat> getCat(@Parameter(name = "id", required = true) @RequestParam Long id) {
        return wrapper((s) -> catService.getCat(id));
    }

    @DeleteMapping(value = "deleteCat", produces = "application/json")
    @Operation(summary = "Удалить кота", tags = {"Кошачье АПИ"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public void deleteCat(@RequestParam Long id) {
        catService.deleteCat(id);
    }
}
