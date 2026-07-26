package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.DriverLicenseRepository;
import ru.practice.kotouslugi.dao.DrivingSchoolRepository;
import ru.practice.kotouslugi.dao.LicenseCategoryRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.DriverLicense;
import ru.practice.kotouslugi.model.DrivingSchool;
import ru.practice.kotouslugi.model.LicenseCategory;
import ru.practice.kotouslugi.model.enums.DriverLicenseStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedList;
import java.util.List;

@Service
public class DriverLicenseService {

    private final DriverLicenseRepository driverLicenseRepository;
    private final LicenseCategoryRepository categoryRepository;
    private final DrivingSchoolRepository drivingSchoolRepository;

    public DriverLicenseService(DriverLicenseRepository driverLicenseRepository,
                                LicenseCategoryRepository categoryRepository,
                                DrivingSchoolRepository drivingSchoolRepository) {
        this.driverLicenseRepository = driverLicenseRepository;
        this.categoryRepository = categoryRepository;
        this.drivingSchoolRepository = drivingSchoolRepository;
    }

    public Integer createApplication(DriverLicense driverLicense) throws ServiceException {
        validateCatAge(driverLicense.getCategories(), driverLicense.getAge());
        checkExamSlot(driverLicense.getDrivingSchool(), driverLicense.getExamDate(), driverLicense.getExamTime());
        driverLicense.setStatus(DriverLicenseStatus.SUBMITTED);
        return driverLicenseRepository.save(driverLicense).getId();
    }

    public void validateCatAge(String categoryCode, Integer age) throws ServiceException {
        if (age == null || age <= 0)
            throw new ServiceException("Укажите корректный возраст кота");
        LicenseCategory category = categoryRepository.findByCode(categoryCode);
        if (category == null)
            throw new ServiceException("Категория прав не найдена: " + categoryCode);
        if (age < category.getMinAge())
            throw new ServiceException("Минимальный возраст для категории " + categoryCode
                    + " — " + category.getMinAge() + " лет. Возраст кота: " + age);
    }

    public void checkExamSlot(String schoolName, LocalDate examDate, LocalTime examTime) throws ServiceException {
        if (examDate != null && examDate.isBefore(LocalDate.now()))
            throw new ServiceException("Дата экзамена не может быть в прошлом");
        DrivingSchool school = drivingSchoolRepository.findByName(schoolName);
        if (school == null)
            throw new ServiceException("Автошкола не найдена: " + schoolName);
        long booked = driverLicenseRepository.countBySlot(schoolName, examDate, examTime);
        if (booked >= school.getMaxPerSlot())
            throw new ServiceException("Выбранный слот уже занят, выберите другое время");
    }

    public Boolean updateStatus(Integer id, DriverLicenseStatus newStatus) throws ServiceException {
        DriverLicense driverLicense = driverLicenseRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Заявление не найдено: " + id));
        driverLicense.setStatus(newStatus);
        driverLicenseRepository.save(driverLicense);
        return true;
    }

    public List<DriverLicense> listApplications() {
        List<DriverLicense> result = new LinkedList<>();
        driverLicenseRepository.findAll().forEach(result::add);
        return result;
    }

    public DriverLicense getById(Integer id) throws ServiceException {
        return driverLicenseRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Заявление не найдено: " + id));
    }
}
