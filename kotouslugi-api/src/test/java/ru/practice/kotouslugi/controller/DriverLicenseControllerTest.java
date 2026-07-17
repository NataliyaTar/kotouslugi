package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.DriverLicense;
import ru.practice.kotouslugi.model.enums.DriverLicenseStatus;
import ru.practice.kotouslugi.service.DriverLicenseService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DriverLicenseControllerTest {

    private MockMvc mockMvc;
    private DriverLicenseService driverLicenseService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        driverLicenseService = mock(DriverLicenseService.class);
        DriverLicenseController controller = new DriverLicenseController(driverLicenseService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnApplicationList() throws Exception {
        doReturn(List.of(getTestLicense())).when(driverLicenseService).listApplications();

        mockMvc.perform(get("/api/driver-license/list")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].catName").value("Мурзик"));

        verify(driverLicenseService).listApplications();
    }

    @Test
    void shouldCreateApplication() throws Exception {
        doReturn(1).when(driverLicenseService).createApplication(any());

        mockMvc.perform(post("/api/driver-license/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(getTestLicense())))
            .andDo(print())
            .andExpect(status().isOk());

        verify(driverLicenseService).createApplication(any());
    }

    private DriverLicense getTestLicense() {
        return DriverLicense.builder()
            .id(1)
            .catName("Мурзик")
            .age(3)
            .breed("Сибирский")
            .categories("B")
            .drivingSchool("КотоАвтошкола")
            .examDate(LocalDate.of(2026, 8, 1))
            .examTime(LocalTime.of(10, 0))
            .status(DriverLicenseStatus.SUBMITTED)
            .build();
    }
}
