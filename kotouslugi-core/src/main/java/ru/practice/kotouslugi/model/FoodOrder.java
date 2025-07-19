package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "food_order")
public class FoodOrder {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "cat_id")
  private Long catId;

  @Column(name = "owner_name")
  private String ownerName;

  private String telephone;
  private String email;
  private String city;
  private String street;
  private String house;
  private String apartment;

  @Column(name = "shop_id")
  private Long shopId;

  @Column(name = "delivery_date")
  private LocalDate deliveryDate;

  @Column(name = "delivery_time")
  private LocalTime deliveryTime;

  private String comment;
  private String status;

  // Геттеры и сеттеры
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getCatId() {
    return catId;
  }

  public void setCatId(Long catId) {
    this.catId = catId;
  }

  public String getOwnerName() {
    return ownerName;
  }

  public void setOwnerName(String ownerName) {
    this.ownerName = ownerName;
  }

  public String getTelephone() {
    return telephone;
  }

  public void setTelephone(String telephone) {
    this.telephone = telephone;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getStreet() {
    return street;
  }

  public void setStreet(String street) {
    this.street = street;
  }

  public String getHouse() {
    return house;
  }

  public void setHouse(String house) {
    this.house = house;
  }

  public String getApartment() {
    return apartment;
  }

  public void setApartment(String apartment) {
    this.apartment = apartment;
  }

  public Long getShopId() {
    return shopId;
  }

  public void setShopId(Long shopId) {
    this.shopId = shopId;
  }

  public LocalDate getDeliveryDate() {
    return deliveryDate;
  }

  public void setDeliveryDate(LocalDate deliveryDate) {
    this.deliveryDate = deliveryDate;
  }

  public LocalTime getDeliveryTime() {
    return deliveryTime;
  }

  public void setDeliveryTime(LocalTime deliveryTime) {
    this.deliveryTime = deliveryTime;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}
