package ru.practice.kotouslugi.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Cat;
import ru.practice.kotouslugi.model.SchoolReview;
import ru.practice.kotouslugi.service.DrivingSchoolReviewService;

import java.util.List;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DrivingSchoolReviewControllerTest {

    private MockMvc mockMvc;
    private DrivingSchoolReviewService drivingSchoolReviewService;

    @BeforeEach
    void setUp() {
        drivingSchoolReviewService = mock(DrivingSchoolReviewService.class);
        DrivingSchoolReviewController controller = new DrivingSchoolReviewController(drivingSchoolReviewService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnReviewList() throws Exception {
        Cat cat = Cat.builder().id(1L).name("Мурзик").build();
        SchoolReview review = SchoolReview.builder()
            .id(1)
            .cat(cat)
            .schoolName("КотоАвтошкола")
            .schoolRating(5)
            .comment("Отличная автошкола!")
            .build();

        doReturn(List.of(review)).when(drivingSchoolReviewService).listReviews();

        mockMvc.perform(get("/api/school-review/list")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].schoolName").value("КотоАвтошкола"));

        verify(drivingSchoolReviewService).listReviews();
    }
}
