package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.practice.kotouslugi.model.Applications;

import java.util.List;

public interface ApplicationsRepository extends CrudRepository<Applications, Long>{

  @Modifying
  @Transactional
  @Query("update Applications app set app.status = 'Принят' where app.id = :id")
  int setStatusConfirm(@Param("id") Long id);

  @Modifying
  @Transactional
  @Query("update Applications app set app.status = 'Отклонен' where app.id = :id")
  int setStatusReject(@Param("id") Long id);

  @Query("select app from Applications app join app.clubs club where app.status = 'Принят' and club.id = :id")
  List<Applications> findAcceptedApplicationsById(@Param("id") Long id);

  @Query("select app from Applications app join app.clubs club where app.status = 'Ожидание' and club.id = :id")
  List<Applications> findExpectationApplicationsById(@Param("id") Long id);

}
