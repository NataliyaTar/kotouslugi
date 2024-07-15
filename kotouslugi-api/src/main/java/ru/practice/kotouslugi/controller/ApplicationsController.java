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
import ru.practice.kotouslugi.model.Applications;
import ru.practice.kotouslugi.service.ApplicationsService;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "ApplicationsController", description = "Методы для работы с АПИ заявок")
public class ApplicationsController extends BaseController{
    private final ApplicationsService applicationsService;

    public ApplicationsController(ApplicationsService applicationsService) { this.applicationsService = applicationsService; }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список заявок", tags = {"АПИ заявок"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Applications> listapplications() {
      return applicationsService.listApplications();
    }

    @GetMapping(value = "/getAccepted", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список участников клуба", tags = {"АПИ заявок"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Applications> listacceptedapplications(@Parameter(name = "id", required = true) @RequestParam Long id){ return applicationsService.findAcceptedApplicationsById(id); }

    @GetMapping(value = "/getExpectation", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список заявок в клуб", tags = {"АПИ заявок"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Applications> listexpectationapplications(@Parameter(name = "id", required = true) @RequestParam Long id){ return applicationsService.findExpectationApplicationsById(id); }

    @PostMapping(value = "/add", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Добавить заявку", tags = {"АПИ заявок"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Long> addApplications(@RequestBody Applications applications) {
        return wrapper((s) -> applicationsService.addApplications(applications));
    }

    @PostMapping(value = "/confirm", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Подтвердить заявку", tags = {"АПИ заявок"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public void confirmApplications(@RequestBody Long id) {
      applicationsService.confirmApplications(id);
    }

    @PostMapping(value = "/reject", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Отклонить заявку", tags = {"АПИ заявок"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public void rejectApplications(@RequestBody Long id) {
      applicationsService.rejectApplications(id);
    }

    @DeleteMapping(value = "delete", produces = "application/json")
    @Operation(summary = "Удалить заявку", tags = {"АПИ заявок"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public void deleteApplications(@RequestParam Long id) {
      applicationsService.delete(id);
    }

}
