package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.Banner;

public interface BannerRepository extends CrudRepository<Banner, Long> {

}
