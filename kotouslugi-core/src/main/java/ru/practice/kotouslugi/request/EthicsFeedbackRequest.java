package ru.practice.kotouslugi.request;

public class EthicsFeedbackRequest {
  private int rating;

  public int getRating() {
    return rating;
  }

  public void setRating(int rating) {
    this.rating = rating;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  private String comment;
}
