package ru.practice.kotouslugi.model;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
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
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Transient
  private String name;

  private String mnemonic;

  @Enumerated(EnumType.STRING)
  private RequisitionStatus status;

  @Temporal(TemporalType.TIMESTAMP)
  private Date created;

  @JsonDeserialize(using = Requisition.StringDeserializer.class)
  @Column(name = "fields", columnDefinition = "TEXT")
  private String fields;

  public static class StringDeserializer extends JsonDeserializer<String> {
    @Override
    public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
      if (p.currentToken() == JsonToken.START_OBJECT) {
        return p.readValueAsTree().toString();
      }
      return p.getValueAsString();
    }
  }
}
