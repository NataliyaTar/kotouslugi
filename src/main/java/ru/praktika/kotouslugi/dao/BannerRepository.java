package ru.praktika.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.praktika.kotouslugi.model.Banner;

public interface BannerRepository extends CrudRepository<Banner, Long> {

}
