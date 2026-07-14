package ru.practice.kotouslugi.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<String> handleNotFound(EntityNotFoundException e) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
  }

  @ExceptionHandler(DuplicateEntityException.class)
  public ResponseEntity<String> handleDuplicate(DuplicateEntityException e){
    return ResponseEntity.status(409).body(e.getMessage());
  }
  @ExceptionHandler(InvalidOperationException.class)
  public ResponseEntity<String> invalidOperation(InvalidOperationException e){
    return ResponseEntity.status(400).body(e.getMessage());
  }

  @ExceptionHandler(ServiceException.class)
  public ResponseEntity<String> handleServiceExc(ServiceException e){
    return ResponseEntity.status(500).body(e.getMessage());
  }

}
