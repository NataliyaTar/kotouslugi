package ru.practice.kotouslugi.request;

public class EthicsFeedbackRequest {
  private int rating;

  private String comment;

  private int orderId;

  public int getRating() {
    return rating;
  }

  public void setRating(int rating) {
    this.rating = rating;
  }

  public String getComment() {
    return comment;
  }

  public int getOrderId() {
    return orderId;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public void setOrderId (int id) {
    this.orderId = id;
  }
}
