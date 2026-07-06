package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.KotoServiceEntity;

import java.util.List;

public interface KotoServiceRepository extends CrudRepository<KotoServiceEntity, Long> {
    @Query("SELECT DISTINCT s FROM KotoServiceEntity s LEFT JOIN FETCH s.categories")
    List<KotoServiceEntity> findAllWithCategories();

    @Query("SELECT s FROM KotoServiceEntity s LEFT JOIN FETCH s.categories WHERE s.id = :id")
    KotoServiceEntity findByServiceIdWithCategories(@Param("id") Integer id);

    @Query("from KotoServiceEntity kse where kse.id = :id")
    KotoServiceEntity findByServiceId(@Param("id") Integer id);

    @Query("select kse.title from KotoServiceEntity kse where kse.mnemonic = :mnemonic")
    String findTitleByServiceMnemonic(@Param("mnemonic") String mnemonic);
}
