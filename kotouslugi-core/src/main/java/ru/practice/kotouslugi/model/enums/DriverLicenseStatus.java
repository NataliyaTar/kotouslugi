package ru.practice.kotouslugi.model.enums;

public enum DriverLicenseStatus {
    SUBMITTED("Заявка подана"),
    UNDER_REVIEW("На проверке"),
    ADMITTED("Допущен к экзамену");

    private final String label;

    DriverLicenseStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
