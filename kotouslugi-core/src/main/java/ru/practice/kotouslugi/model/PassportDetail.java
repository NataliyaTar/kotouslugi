package ru.practice.kotouslugi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
@Data
@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "passport_detail",
  indexes = {
    @Index(name = "idx_pd_passport_num", columnList = "passportNumber", unique = true),
    @Index(name = "idx_pd_requisition", columnList = "requisition_id", unique = true),
    @Index(name = "idx_pd_owner_email", columnList = "ownerEmail"),
    @Index(name = "idx_pd_issue_date", columnList = "issueDate"),
    @Index(name = "idx_pd_status", columnList = "status")
  }
)
public class PassportDetail {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn()
  private Requisition requisition;

  @Column(name = "passportNumber", nullable = false, unique = true, length = 20)
  private String passportNumber;

  @Column(name = "issueDate")
  private LocalDate issueDate;


  @Column(name = "country", nullable = false)
  private String country = "РФ";

  @Column(name = "ownerPhone", nullable = false, length = 20)
  private String ownerPhone;

  @Column(name = "ownerEmail", nullable = false, length = 100)
  private String ownerEmail;

  @Column(name = "photoUrl", nullable = false, length = 500)
  private String photoUrl;

  @Column(name = "specialMarks", columnDefinition = "TEXT")
  private String specialMarks;

  @Column(name = "status", nullable = false)
  private boolean status; //true - актуален

  @Column(name = "chipNumber", length = 50)
  private String chipNumber;

}
