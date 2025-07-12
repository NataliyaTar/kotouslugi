package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.HotelRecord;
import ru.practice.kotouslugi.service.HotelRecordService;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/hotel-record")
@Tag(name = "HotelRecordController", description = "Методы для работы с записями на передержку котиков")
public class HotelRecordController {
    private final HotelRecordService hotelRecordService;

    public HotelRecordController(HotelRecordService hotelRecordService) {
        this.hotelRecordService = hotelRecordService;
    }

    @PostMapping(value = "/book", produces = "application/json")
    @Operation(summary = "Записать котика на передержку", tags = {"Передержка котиков"}, responses = {
        @ApiResponse(responseCode = "200", description = "Запись успешно создана"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные"),
        @ApiResponse(responseCode = "409", description = "Нет свободных мест"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Long> bookOverexposure(@RequestBody HotelRecord record) {
        try {
            // Проверка наличия мест
            boolean hasSpace = hotelRecordService.spaceCheck(record.getIdHotel(), record.getRecordStart(), record.getRecordFinish());
            if (!hasSpace) {
                return ResponseEntity.status(409).body(null); // Нет мест
            }
            // Сохранение записи
            Long recordId = hotelRecordService.overexposure(record);
            if (recordId != null) {
                return ResponseEntity.ok(recordId);
            } else {
                return ResponseEntity.status(500).body(null);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Некорректные данные
        }
    }

    @GetMapping(value = "/check-availability", produces = "application/json")
    @Operation(summary = "Проверить наличие свободных мест в отеле", tags = {"Передержка котиков"}, responses = {
        @ApiResponse(responseCode = "200", description = "Информация о доступности"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    //Проверка доступности
    public ResponseEntity<Boolean> checkAvailability(
            @Parameter(description = "ID отеля") @RequestParam Long hotelId,
            @Parameter(description = "Дата начала (формат: yyyy-MM-dd'T'HH:mm)") @RequestParam String start,
            @Parameter(description = "Дата окончания (формат: yyyy-MM-dd'T'HH:mm)") @RequestParam String finish) {
        try {
            LocalDateTime startDate = LocalDateTime.parse(start);
            LocalDateTime finishDate = LocalDateTime.parse(finish);
            boolean hasSpace = hotelRecordService.spaceCheck(hotelId, startDate, finishDate);
            return ResponseEntity.ok(hasSpace);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(false);
        }
    }
}
