package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.KotoServiceEntity;

public interface KotoServiceRepository extends CrudRepository<KotoServiceEntity, Long> {
    @Query("from KotoServiceEntity kse where kse.id = :id")
    KotoServiceEntity findByServiceId(@Param("id") Integer id);

    @Query("select kse.title from KotoServiceEntity kse where kse.mnemonic = :mnemonic")
    String findTitleByServiceMnemonic(@Param("mnemonic") String mnemonic);
}
