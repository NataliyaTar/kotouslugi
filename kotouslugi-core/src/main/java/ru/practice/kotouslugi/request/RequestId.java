package ru.practice.kotouslugi.request;

import java.io.Serializable;

public class RequestId implements Serializable {
    private Integer id;

    public RequestId(Integer id) {
      this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public static RequestId asRequestId(Integer id) {
      return new RequestId(id);
    }
}
