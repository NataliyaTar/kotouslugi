package ru.practice.kotouslugi.model.enums;

public enum FineStatus {
    UNPAID("Не оплачен"),
    PAID("Оплачен");

    private String message;

    FineStatus(String message) {
        this.message = message;
    }
}
