package com.artiq.back.user.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "user_info")
public class UserEntity {
    // 유저 정보 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_no")
    private Long userNo;

    @Column(length = 50, name = "user_email", unique = true)
    private String userEmail;

    @Column(length = 300, name = "user_pw")
    private String userPw;

    @Column(length = 50, name = "user_name")
    private String userName;

    @Column(length = 50, name = "user_tel")
    private String userTel;

    @Column(name = "user_Birth")
    private LocalDate userBirth;

    @Column(length = 50, name = "user_nickname")
    private String userNickname;

    @Column(length = 50, name = "user_zipCode")
    private String userZipCode;

    @Column(length = 100, name = "user_addr")
    private String userAddr;

    @Column(length = 50, name = "user_detail_addr")
    private String userDetailAddr;

    @Column(length = 100, name = "user_profile")
    private String userProfile;

    @Column(name = "user_date")
    private LocalDate userDate = LocalDate.now();

    // 관리하기 편하도록 enum 사용
    @Column(name = "user_role")
    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    // public UserEntity update(String name, String email) {
    // this.userName = name;
    // this.userEmail = email;

    // return this;
    // }

}
