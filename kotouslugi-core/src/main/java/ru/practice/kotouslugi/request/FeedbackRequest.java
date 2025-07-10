package ru.practice.kotouslugi.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {
  private Long id;
  private int grade;
  private String review;
}
