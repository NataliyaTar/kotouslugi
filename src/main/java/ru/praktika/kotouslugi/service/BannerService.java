package ru.praktika.kotouslugi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.praktika.kotouslugi.dao.BannerRepository;
import ru.praktika.kotouslugi.model.Banner;

import java.util.LinkedList;
import java.util.List;

@Service
public class BannerService {

  private static final Logger logger = LoggerFactory.getLogger(BannerService.class);
    @Autowired
    private BannerRepository bannerRepository;

    public List<Banner> listBanner() {
        List<Banner> list = new LinkedList<>();
        Iterable<Banner> all = bannerRepository.findAll();
        all.forEach(list::add);
        return list;
    }
}
