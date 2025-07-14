package ru.practice.kotouslugi.request;

import java.time.LocalDateTime;

public class EthicsRequest {
  private String catName;
  private LocalDateTime startTime;
  private String courseType;
  private String teacherName;
  private String teacherAbout;
  private String ownerName;
  private String phoneNumber;
  private String email;

  public String getCatName() {
    return catName;
  }

  public void setCatName(String catName) {
    this.catName = catName;
  }

  public String getCourseType() {
    return courseType;
  }

  public void setCourseType(String courseType) {
    this.courseType = courseType;
  }

  public String getTeacherName() {
    return teacherName;
  }

  public void setTeacherName(String teacherName) {
    this.teacherName = teacherName;
  }

  public String getTeacherAbout() {
    return teacherAbout;
  }

  public void setTeacherAbout(String teacherAbout) {
    this.teacherAbout = teacherAbout;
  }

  public String getOwnerName() {
    return ownerName;
  }

  public void setOwnerName(String ownerName) {
    this.ownerName = ownerName;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public LocalDateTime getStartTime() {
    return startTime;
  }

  public void setStartTime(LocalDateTime startTime) {
    this.startTime = startTime;
  }
}
