package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.ExamRepository;
import ru.practice.kotouslugi.model.Exam;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ExamServiceTest {
  private ExamRepository examRepository;
  private ExamService examService;

  @BeforeEach
  public void setUp() {
    examRepository = mock(ExamRepository.class);
    examService = new ExamService(examRepository);
  }

  @Test
  void shouldReturnExamListForCatByID() {
    when(examRepository.findByIdCat(0L)).thenReturn(
      getExamListForCatByID()
    );

    examService.findExamsByCatId(0L);

    verify(examRepository).findByIdCat(0L);
  }

  private List<Exam> getExamListForCatByID() {
    return List.of(
      Exam.builder()
        .examId(1L)
        .subjectName("Математика")
        .score(85)
        .idCat(0L)
        .build()
    );
  }
}
