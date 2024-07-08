package ru.practice.kotouslugi.exception;
//пенис (проверка ес чо)
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceException extends Exception {
    private Object data;

    public ServiceException(String message) {
        super(message);
    }

    public ServiceException(String message, Object data) {
        super(message);
        this.data = data;
    }
}

