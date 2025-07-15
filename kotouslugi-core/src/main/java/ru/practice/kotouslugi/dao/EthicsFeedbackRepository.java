package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.practice.kotouslugi.model.EthicsFeedback;

public interface EthicsFeedbackRepository extends JpaRepository<EthicsFeedback, Long> {

}
