package ru.practice.kotouslugi.model.enums;

public enum StatementStatus {
  CREATED,
  SENT_TO_MVD,
  READY_IN_MVD,
  REJECTED_IN_MVD,
  ERROR_IN_MVD, // ответ от МВД не пришёл, нужно будет отправлять заново.
  SENT_TO_BANK,
  APPROVED_BY_BANK,
  REJECTED_IN_BANK,
  ERROR_IN_BANK
}
