package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import ru.practice.kotouslugi.model.PedigreeLink;

import java.util.List;

public interface PedigreeLinkRepository extends CrudRepository<PedigreeLink, Long> {
    List<PedigreeLink> findByPassportId(Long passportId);
    List<PedigreeLink> findByRelativePassportId(Long relativePassportId);
}
