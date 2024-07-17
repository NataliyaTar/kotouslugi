package ru.practice.kotouslugi.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Exam;
import ru.practice.kotouslugi.service.ExamService;

import java.util.List;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ExamControllerTest {
    private MockMvc mockMvc;
    private ExamService examService;

    @BeforeEach
    void setUp() {
        examService = mock(ExamService.class);
        ExamController controller = new ExamController(examService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnExamListForCatByID() throws Exception {
        Long catId = 0L;

        doReturn(
            List.of(
                Exam.builder()
                        .examId(1L)
                        .subjectName("Математика")
                        .score(85)
                        .idCat(catId)
                        .build()
            )
        ).when(examService).findExamsByCatId(catId);

        mockMvc.perform(get("/api/exam/cat/{idCat}", catId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].examId").value(1L))
                .andExpect(jsonPath("$[0].subjectName").value("Математика"))
                .andExpect(jsonPath("$[0].score").value(85));

        verify(examService).findExamsByCatId(catId);
    }
}
