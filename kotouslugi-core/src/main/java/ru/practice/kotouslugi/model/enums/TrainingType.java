package ru.practice.kotouslugi.model.enums;

public enum TrainingType {
    GROUP("Групповой"),
    PERSONAL("Персональный"),
    FREE("Свободный");

    private final String label;

    TrainingType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
} 