package ru.practice.kotouslugi.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.util.FunctionSE;

public class BaseController {

  private static final Logger log = LoggerFactory.getLogger(BaseController.class);

  protected <T> ResponseEntity<T> wrapper(FunctionSE<T> f) {
    try {
      return new ResponseEntity<>(f.apply(null), HttpStatusCode.valueOf(200));
    } catch (ServiceException e) {
      log.error("Service error: {}", e.getMessage(), e);
      return new ResponseEntity<>(HttpStatusCode.valueOf(500));
    }
  }
}
