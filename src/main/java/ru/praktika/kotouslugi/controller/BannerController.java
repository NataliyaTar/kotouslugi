package ru.praktika.kotouslugi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.praktika.kotouslugi.model.Banner;
import ru.praktika.kotouslugi.service.BannerService;

import java.util.List;


@RestController
@RequestMapping("/api/banner")
public class BannerController {

    @Autowired
    private BannerService bannerService;

    @RequestMapping(value = "listBanner", method = RequestMethod.GET, produces = "application/json")
    public List<Banner> listBanner() {
      return bannerService.listBanner();
    }
}
