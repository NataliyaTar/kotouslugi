package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.DriverLicenseRepository;
import ru.practice.kotouslugi.dao.DrivingSchoolRepository;
import ru.practice.kotouslugi.dao.LicenseCategoryRepository;
import ru.practice.kotouslugi.model.DriverLicense;
import ru.practice.kotouslugi.model.enums.DriverLicenseStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DriverLicenseServiceTest {

    private DriverLicenseRepository driverLicenseRepository;
    private DriverLicenseService driverLicenseService;

    @BeforeEach
    void setUp() {
        driverLicenseRepository = mock(DriverLicenseRepository.class);
        LicenseCategoryRepository categoryRepository = mock(LicenseCategoryRepository.class);
        DrivingSchoolRepository drivingSchoolRepository = mock(DrivingSchoolRepository.class);
        driverLicenseService = new DriverLicenseService(driverLicenseRepository, categoryRepository, drivingSchoolRepository);
    }

    @Test
    void shouldListApplications() {
        when(driverLicenseRepository.findAll()).thenReturn(
            () -> List.of(DriverLicense.builder()
                .id(1)
                .catName("Мурзик")
                .age(3)
                .categories("B")
                .drivingSchool("КотоАвтошкола")
                .examDate(LocalDate.now().plusDays(7))
                .examTime(LocalTime.of(10, 0))
                .status(DriverLicenseStatus.SUBMITTED)
                .build()).iterator()
        );

        driverLicenseService.listApplications();

        verify(driverLicenseRepository).findAll();
    }
}
