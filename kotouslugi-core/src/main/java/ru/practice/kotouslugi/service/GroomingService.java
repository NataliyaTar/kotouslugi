package ru.practice.kotouslugi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.GroomerRepository;
import ru.practice.kotouslugi.dao.GroomingAppointmentRepository;
import ru.practice.kotouslugi.dao.GroomingNotificationRepository;
import ru.practice.kotouslugi.dao.GroomingReviewRepository;
import ru.practice.kotouslugi.dao.GroomingSalonRepository;
import ru.practice.kotouslugi.model.Groomer;
import ru.practice.kotouslugi.model.GroomingAppointment;
import ru.practice.kotouslugi.model.GroomingNotification;
import ru.practice.kotouslugi.model.GroomingReview;
import ru.practice.kotouslugi.model.GroomingSalon;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.model.dto.GroomingReviewRequest;
import ru.practice.kotouslugi.model.dto.GroomingSlotDto;
import ru.practice.kotouslugi.model.enums.GroomingAppointmentStatus;
import ru.practice.kotouslugi.model.enums.GroomingNotificationStatus;
import ru.practice.kotouslugi.model.enums.GroomingNotificationType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class GroomingService {
    private static final Logger logger = LoggerFactory.getLogger(GroomingService.class);

    private final GroomingSalonRepository salonRepository;
    private final GroomerRepository groomerRepository;
    private final GroomingAppointmentRepository appointmentRepository;
    private final GroomingReviewRepository reviewRepository;
    private final GroomingNotificationRepository notificationRepository;
    private final ObjectMapper objectMapper;

    public GroomingService(GroomingSalonRepository salonRepository,
                           GroomerRepository groomerRepository,
                           GroomingAppointmentRepository appointmentRepository,
                           GroomingReviewRepository reviewRepository,
                           GroomingNotificationRepository notificationRepository) {
        this.salonRepository = salonRepository;
        this.groomerRepository = groomerRepository;
        this.appointmentRepository = appointmentRepository;
        this.reviewRepository = reviewRepository;
        this.notificationRepository = notificationRepository;
        this.objectMapper = new ObjectMapper();
    }

    public List<GroomingSalon> listSalons() {
        return salonRepository.findAll();
    }

    public List<Groomer> listGroomers(Long salonId) {
        if (salonId == null) {
            return List.of();
        }
        return groomerRepository.findBySalonId(salonId);
    }

    public List<GroomingSlotDto> listAvailableSlots(Long salonId, LocalDate visitDate) {
        if (salonId == null || visitDate == null) {
            return List.of();
        }
        Optional<GroomingSalon> salonOpt = salonRepository.findById(salonId);
        if (salonOpt.isEmpty() || salonOpt.get().getAvailableTimes() == null) {
            return List.of();
        }

        Set<String> busyTimes = new HashSet<>();
        for (GroomingAppointment appointment : appointmentRepository.findBySalonIdAndVisitDate(salonId, visitDate)) {
            if (appointment.getStatus() == GroomingAppointmentStatus.SALON_CONFIRMED
                    || appointment.getStatus() == GroomingAppointmentStatus.PENDING) {
                busyTimes.add(appointment.getVisitTime());
            }
        }

        List<GroomingSlotDto> result = new ArrayList<>();
        for (String slot : salonOpt.get().getAvailableTimes().split(",")) {
            String time = slot.trim();
            if (time.isEmpty()) {
                continue;
            }
            result.add(GroomingSlotDto.builder()
                    .time(time)
                    .available(!busyTimes.contains(time))
                    .build());
        }
        return result;
    }

    public List<GroomingAppointment> listAppointments(Long catId) {
        if (catId == null) {
            return appointmentRepository.findAll();
        }
        return appointmentRepository.findByCatId(catId);
    }

    public List<GroomingReview> listReviews(Long salonId) {
        if (salonId == null) {
            List<GroomingReview> result = new LinkedList<>();
            reviewRepository.findAll().forEach(result::add);
            return result;
        }
        return reviewRepository.findBySalonId(salonId);
    }

    public GroomingReview submitReview(GroomingReviewRequest request) {
        if (request == null || request.getAppointmentId() == null) {
            return null;
        }
        Optional<GroomingAppointment> appointmentOpt = appointmentRepository.findById(request.getAppointmentId());
        if (appointmentOpt.isEmpty()) {
            return null;
        }
        GroomingAppointment appointment = appointmentOpt.get();
        GroomingReview review = GroomingReview.builder()
                .appointmentId(appointment.getId())
                .salonId(appointment.getSalonId())
                .catId(appointment.getCatId())
                .rating(request.getRating())
                .comment(request.getComment())
                .forwardedToSalon(true)
                .created(new Date())
                .build();
        GroomingReview saved = reviewRepository.save(review);
        logger.info("Отзыв {} перенаправлен в салон {}", saved.getId(), saved.getSalonId());
        return saved;
    }

    public void createAppointmentFromRequisition(Requisition requisition) {
        try {
            JsonNode steps = objectMapper.readTree(requisition.getFields());

            Long catId = getLong(steps, "cat");
            Long salonId = getLong(steps, "salonId");
            Long groomerId = getLong(steps, "groomerId");
            String packageType = getText(steps, "packageType");
            String ownerContact = getText(steps, "ownerContact");
            String notes = getText(steps, "notes");
            String visitTime = getText(steps, "visitTime");
            LocalDate visitDate = parseDate(getText(steps, "visitDate"));

            GroomingAppointment appointment = GroomingAppointment.builder()
                    .requisitionId(requisition.getId())
                    .catId(catId)
                    .salonId(salonId)
                    .groomerId(groomerId)
                    .packageType(packageType)
                    .ownerContact(ownerContact)
                    .notes(notes)
                    .visitDate(visitDate)
                    .visitTime(visitTime)
                    .status(GroomingAppointmentStatus.PENDING)
                    .created(new Date())
                    .build();

            String resultMessage = validateAndSendToSalon(appointment);
            appointment.setSalonResponse(resultMessage);
            appointment = appointmentRepository.save(appointment);

            saveResultNotification(appointment);
            saveReminderNotification(appointment);

        } catch (Exception e) {
            logger.error("Ошибка создания записи к грумеру из заявки: {}", e.getMessage());
        }
    }

    public void createReviewFromRequisition(Requisition requisition) {
        try {
            JsonNode steps = objectMapper.readTree(requisition.getFields());
            Long appointmentId = getLong(steps, "appointmentId");
            Integer rating = getInteger(steps, "rating");
            String comment = getText(steps, "comment");

            if (appointmentId == null) {
                logger.warn("Отзыв не создан: не указан appointmentId в заявке {}", requisition.getId());
                return;
            }

            GroomingReviewRequest request = new GroomingReviewRequest();
            request.setAppointmentId(appointmentId);
            request.setRating(rating);
            request.setComment(comment);
            submitReview(request);
        } catch (Exception e) {
            logger.error("Ошибка создания отзыва из заявки: {}", e.getMessage());
        }
    }

    private String validateAndSendToSalon(GroomingAppointment appointment) {
        if (appointment.getCatId() == null || appointment.getSalonId() == null
                || appointment.getVisitDate() == null || appointment.getVisitTime() == null) {
            appointment.setStatus(GroomingAppointmentStatus.SALON_REJECTED);
            return "Салон отклонил запись: не заполнены обязательные данные";
        }

        Optional<GroomingSalon> salonOpt = salonRepository.findById(appointment.getSalonId());
        if (salonOpt.isEmpty()) {
            appointment.setStatus(GroomingAppointmentStatus.SALON_REJECTED);
            return "Салон отклонил запись: салон не найден";
        }

        GroomingSalon salon = salonOpt.get();
        if (Boolean.TRUE.equals(salon.getProvidesGroomers()) && appointment.getGroomerId() == null) {
            appointment.setStatus(GroomingAppointmentStatus.SALON_REJECTED);
            return "Салон отклонил запись: выберите грумера";
        }

        if (appointment.getGroomerId() != null) {
            boolean groomerExists = groomerRepository.findBySalonId(appointment.getSalonId())
                    .stream()
                    .anyMatch(g -> g.getId().equals(appointment.getGroomerId()));
            if (!groomerExists) {
                appointment.setStatus(GroomingAppointmentStatus.SALON_REJECTED);
                return "Салон отклонил запись: выбранный грумер недоступен";
            }
        }

        boolean slotIsBusy = appointmentRepository.findBySalonIdAndVisitDate(appointment.getSalonId(), appointment.getVisitDate())
                .stream()
                .anyMatch(a -> appointment.getVisitTime().equals(a.getVisitTime())
                        && a.getStatus() == GroomingAppointmentStatus.SALON_CONFIRMED);
        if (slotIsBusy) {
            appointment.setStatus(GroomingAppointmentStatus.SALON_REJECTED);
            return "Салон отклонил запись: это время уже занято";
        }

        appointment.setStatus(GroomingAppointmentStatus.SALON_CONFIRMED);
        return "Запись подтверждена салоном. Ждем вас в назначенное время!";
    }

    private void saveResultNotification(GroomingAppointment appointment) {
        String message = appointment.getStatus() == GroomingAppointmentStatus.SALON_CONFIRMED
                ? "Уведомление пользователю: " + appointment.getSalonResponse()
                : "Уведомление пользователю: запись не подтверждена. " + appointment.getSalonResponse();

        GroomingNotification result = GroomingNotification.builder()
                .appointmentId(appointment.getId())
                .type(GroomingNotificationType.SALON_RESULT)
                .status(GroomingNotificationStatus.SENT)
                .message(message)
                .scheduledAt(new Date())
                .sentAt(new Date())
                .build();
        notificationRepository.save(result);
    }

    private void saveReminderNotification(GroomingAppointment appointment) {
        if (appointment.getStatus() != GroomingAppointmentStatus.SALON_CONFIRMED || appointment.getVisitDate() == null) {
            return;
        }
        LocalDateTime reminderAt = appointment.getVisitDate()
                .minusDays(1)
                .atTime(10, 0);
        Date scheduled = Date.from(reminderAt.atZone(ZoneId.systemDefault()).toInstant());

        GroomingNotification reminder = GroomingNotification.builder()
                .appointmentId(appointment.getId())
                .type(GroomingNotificationType.REMINDER)
                .status(GroomingNotificationStatus.PENDING)
                .message("Напоминание: завтра запись в груминг-салон")
                .scheduledAt(scheduled)
                .build();
        notificationRepository.save(reminder);
    }

    private String getText(JsonNode steps, String field) {
        for (JsonNode step : steps) {
            if (step.has(field) && !step.get(field).isNull()) {
                return step.get(field).asText();
            }
        }
        return null;
    }

    private Long getLong(JsonNode steps, String field) {
        for (JsonNode step : steps) {
            if (!step.has(field) || step.get(field).isNull()) {
                continue;
            }
            JsonNode valueNode = step.get(field);
            if (valueNode.isNumber()) {
                return valueNode.asLong();
            }
            String text = valueNode.asText();
            if (text == null || text.isBlank()) {
                return null;
            }
            try {
                return Long.parseLong(text);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private Integer getInteger(JsonNode steps, String field) {
        for (JsonNode step : steps) {
            if (!step.has(field) || step.get(field).isNull()) {
                continue;
            }
            JsonNode valueNode = step.get(field);
            if (valueNode.isInt() || valueNode.isLong()) {
                return valueNode.asInt();
            }
            String text = valueNode.asText();
            if (text == null || text.isBlank()) {
                return null;
            }
            try {
                return Integer.parseInt(text);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value);
        } catch (Exception e) {
            return null;
        }
    }
}
