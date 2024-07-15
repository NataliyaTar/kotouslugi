package ru.practice.kotouslugi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.ApplicationsRepository;
import ru.practice.kotouslugi.model.Applications;
import ru.practice.kotouslugi.model.Club;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationsService {
    private final ApplicationsRepository applicationsRepository;
    private static final Logger logger = LoggerFactory.getLogger(ApplicationsService.class);

    public ApplicationsService(ApplicationsRepository applicationsRepository) { this.applicationsRepository = applicationsRepository; }

    public List<Applications> listApplications() {
        List<Applications> list = new LinkedList<>();
        Iterable<Applications> all = applicationsRepository.findAll();
        all.forEach(list::add);
        return list;
    }

    public Long addApplications(Applications applications) {
        try {
            applications.setStatusExpectation("Ожидание");
            applications = applicationsRepository.save(applications);
            return null;
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }
    }

    public void confirmApplications(Long id) {
        applicationsRepository.setStatusConfirm(id);
    }

    public void rejectApplications(Long id) {
        applicationsRepository.setStatusReject(id);
    }

    public List<Applications> findAcceptedApplicationsById(Long id) {
        return applicationsRepository.findAcceptedApplicationsById(id);
    }

    public List<Applications> findExpectationApplicationsById(Long id) {
      return applicationsRepository.findExpectationApplicationsById(id);
    }

    public void delete(Long id) {
        Optional<Applications> applications = applicationsRepository.findById(id);
        applications.ifPresent(applicationsRepository::delete);
    }

}
