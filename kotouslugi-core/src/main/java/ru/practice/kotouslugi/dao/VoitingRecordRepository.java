package ru.practice.kotouslugi.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.VoteRecord;

import java.util.Optional;

@Repository
public interface VoitingRecordRepository extends CrudRepository<VoteRecord, Long> {

  boolean existsByCatId(Long catId);
}
