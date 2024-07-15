package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.BannerRepository;
import ru.practice.kotouslugi.model.Banner;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class BannerServiceTest {
    private BannerRepository bannerRepository;
    private BannerService bannerService;

    @BeforeEach
    void setUp() {
        bannerRepository = mock(BannerRepository.class);
        bannerService = new BannerService(bannerRepository);
    }

    @Test
    void shouldReturnBannerList() {
        when(bannerRepository.findAll()).thenReturn(
            () -> getBannerList().iterator()
        );

        bannerService.listBanner();

        verify(bannerRepository).findAll();
    }

    private List<Banner> getBannerList() {
        return List.of(
            Banner.builder()
                .id(1L)
                .title("Хотите завести котёнка?")
                .bg("linear-gradient(86deg, #EDF2FE 0%, #D7E7FF 100%)")
                .imgurl("hugs.png")
                .text("Услуга «Укотоение» поможет подобрать кото-приют и котёнка")
                .build()
        );
    }
}
