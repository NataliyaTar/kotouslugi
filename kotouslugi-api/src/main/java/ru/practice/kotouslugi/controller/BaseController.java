package ru.practice.kotouslugi.controller;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.util.FunctionSE;

public class BaseController {

    protected <T> ResponseEntity<T> wrapper(FunctionSE<T> f) {
        try {
            return new ResponseEntity<>(f.apply(null), HttpStatusCode.valueOf(200));
        } catch (ServiceException e) {
          return new ResponseEntity<>(HttpStatusCode.valueOf(500));
        }
    }
}
