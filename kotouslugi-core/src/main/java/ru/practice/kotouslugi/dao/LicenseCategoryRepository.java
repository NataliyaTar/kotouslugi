package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.LicenseCategory;

public interface LicenseCategoryRepository extends CrudRepository<LicenseCategory, Integer> {
    @Query("from LicenseCategory lc where lc.code = :code")
    LicenseCategory findByCode(@Param("code") String code);
}
