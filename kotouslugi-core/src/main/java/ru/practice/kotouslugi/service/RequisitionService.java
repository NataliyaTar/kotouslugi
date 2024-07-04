package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.RequisitionRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Service
public class RequisitionService {
    private final RequisitionRepository requisitionRepository;

    public RequisitionService(RequisitionRepository requisitionRepository) {
      this.requisitionRepository = requisitionRepository;
    }

    public List<Requisition> listRequisition() {
        List<Requisition> result = new LinkedList<>();
        Iterable<Requisition> requisitions = requisitionRepository.findAll();
        requisitions.forEach(result::add);
        return result;
    }

    public int createRequisition(Requisition requisition) {
        requisition.setStatus(RequisitionStatus.FILED);
        requisition.setCreated(new Date(System.currentTimeMillis()));
        Requisition save = requisitionRepository.save(requisition);
        return save.getId();
    }

    public Boolean updateRequisition(Requisition updRequisition) throws ServiceException {
        String id = String.valueOf(updRequisition.getId());
        if (id.isEmpty() || id.equals("null"))
            throw new ServiceException("Не указан id заявки");
        Integer idRequisite = Integer.parseInt(id);
        Requisition requisition = requisitionRepository.findById(idRequisite).orElse(null);
        if (requisition == null)
            throw new ServiceException("Указанная заявка не найдена: " + idRequisite);

        requisitionRepository.save(updRequisition);
        return true;
    }
}
