package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.BannerRepository;
import ru.practice.kotouslugi.model.Banner;

import java.util.LinkedList;
import java.util.List;

@Service
public class BannerService {
    private final BannerRepository bannerRepository;

  public BannerService(BannerRepository bannerRepository) {
    this.bannerRepository = bannerRepository;
  }

  public List<Banner> listBanner() {
        List<Banner> list = new LinkedList<>();
        Iterable<Banner> all = bannerRepository.findAll();
        all.forEach(list::add);
        return list;
    }
}
