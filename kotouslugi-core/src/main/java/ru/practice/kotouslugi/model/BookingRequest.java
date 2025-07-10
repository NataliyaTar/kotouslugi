package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


import java.time.LocalDateTime;


@Getter
@Setter
@Entity
@Builder
@Table(name = "BookingRequest")
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest
{
  @Id
  @GeneratedValue
  private Long id;
  private int cat_id;
  private String contact_email;
  private String contact_number;
  private int worker_id;
  private LocalDateTime start_time;
  private int id_type_service;
}
