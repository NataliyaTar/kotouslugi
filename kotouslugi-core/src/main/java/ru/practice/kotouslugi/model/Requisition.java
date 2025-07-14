package ru.practice.kotouslugi.model;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.RequisitionStatus;

import jakarta.persistence.*;

import java.io.IOException;
import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "requisition")
public class Requisition implements Serializable {
    @Id
    @GeneratedValue
    private int id;
    @Transient
    private String name;
    private String mnemonic;
    private RequisitionStatus status;
    private Date created;
    @Lob
    @Column(name = "fields")
    private String fields;

    public static class StringDeserializer extends JsonDeserializer<String> {
      @Override
      public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        return p.readValueAsTree().toString();
      }
    }
}
