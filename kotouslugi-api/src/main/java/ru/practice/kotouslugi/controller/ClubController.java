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
import ru.practice.kotouslugi.model.Club;
import ru.practice.kotouslugi.service.ClubService;

import java.util.List;

@RestController
@RequestMapping("/api/club")
@Tag(name = "ClubController", description = "Методы для работы с АПИ клубами")
public class ClubController extends BaseController{
    private final ClubService clubService;

    public ClubController(ClubService clubService) {this.clubService = clubService;}

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список клубов", tags = {"АПИ Клубов"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Club> listClub() {
    return clubService.listClub();
  }

    @PostMapping(value = "/add", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Добавить клуб", tags = {"АПИ Клубов"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Long> addClub(@RequestBody Club club) {return wrapper((s) -> clubService.addClub(club));}

    @GetMapping(value = "/get", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить клуб по идентификатору", tags = {"АПИ Клубов"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Club> getClub(@Parameter(name = "id", required = true) @RequestParam Long id) {
        return wrapper((s) -> clubService.getClub(id));
    }

    @DeleteMapping(value = "/deleteClub", produces = "application/json")
    @Operation(summary = "Удалить клуб", tags = {"АПИ Клубов"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public void deleteClub(@RequestParam Long id) {clubService.deleteClub(id);}
}
