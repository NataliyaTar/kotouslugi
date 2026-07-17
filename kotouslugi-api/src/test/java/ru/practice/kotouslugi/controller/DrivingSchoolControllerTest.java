package ru.practice.kotouslugi.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.dao.DrivingSchoolRepository;
import ru.practice.kotouslugi.dao.LicenseCategoryRepository;
import ru.practice.kotouslugi.model.DrivingSchool;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DrivingSchoolControllerTest {

    private MockMvc mockMvc;
    private DrivingSchoolRepository drivingSchoolRepository;

  @BeforeEach
    void setUp() {
        drivingSchoolRepository = mock(DrivingSchoolRepository.class);
        LicenseCategoryRepository licenseCategoryRepository = mock(LicenseCategoryRepository.class);
        DrivingSchoolController controller = new DrivingSchoolController(drivingSchoolRepository, licenseCategoryRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnSchoolList() throws Exception {
        when(drivingSchoolRepository.findAll()).thenReturn(
            () -> List.of(DrivingSchool.builder()
                .id(1)
                .name("КотоАвтошкола")
                .overallRating(4.5)
                .maxPerSlot(3)
                .build()).iterator()
        );

        mockMvc.perform(get("/api/driving-school/list")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].name").value("КотоАвтошкола"));

        verify(drivingSchoolRepository).findAll();
    }
}
