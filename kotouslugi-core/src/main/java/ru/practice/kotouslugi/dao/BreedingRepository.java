package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.Breeding;
import java.util.List;

@Repository
public interface BreedingRepository extends JpaRepository<Breeding, Long> {

  List<Breeding> findByBreedAndCityAndGenderNot(String breed, String city, String gender);
}
