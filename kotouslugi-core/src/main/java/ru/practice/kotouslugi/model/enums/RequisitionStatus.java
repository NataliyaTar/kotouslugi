package ru.practice.kotouslugi.model.enums;

public enum RequisitionStatus {
    FILED("Подана"),
    UNDER_CONSIDERATION("На рассмотрении"),
    REJECTED("Отклонена"),
    ACCEPTED("Принята"),
    DONE("Готова");

    private String message;

    RequisitionStatus(String message) {
        this.message = message;
    }
}
