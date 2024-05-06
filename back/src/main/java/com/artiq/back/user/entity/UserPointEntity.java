package com.artiq.back.user.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "user_point_pay")
public class UserPointEntity {
    // 포인트 결제 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "point_no")
    private int pointNo;

    @Column(length = 50, name = "point_role")
    private String pointRole; // 충전 OR 사용

    @Column(length = 50, name = "point_certify")
    private String pointCertify; // 결제번호    

    @Column(length = 50, name = "user_email")
    private String userEmail;

    @Column(length = 50, name = "point_charge")
    private String pointCharge; // 충전(사용)포인트

    @Column(length = 50, name = "point_pay")
    private String pointPay; // 충전(사용) 금액

    @Column(length = 1000, name = "point_comment")
    private String pointComment; // 충전(사용) 상세내역

    @Column(name = "point_date")
    private LocalDateTime pointDate; // 충전(사용)일

}
