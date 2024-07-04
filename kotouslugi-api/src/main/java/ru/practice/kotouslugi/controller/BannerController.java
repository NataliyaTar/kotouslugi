package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.*;
import ru.practice.kotouslugi.service.BannerService;

import java.util.List;

@RestController
@RequestMapping("/api/banner")
@Tag(name = "BannerController", description = "Методы для работы с баннерами котоуслуг")
public class BannerController {
  private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
      this.bannerService = bannerService;
    }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список баннеров", tags = {"Тестовые запросы"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Banner> listBanner() {
      return bannerService.listBanner();
    }
}
