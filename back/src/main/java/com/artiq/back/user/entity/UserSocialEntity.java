package com.artiq.back.user.entity;

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
@Table(name = "user_social_media")
public class UserSocialEntity {
    // 소셜로그인 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "social_no")
    private int socialNo;

    @Column(length = 50, name = "user_email")
    private String userEmail;

    @Column(length = 50, name = "social_platform")
    private String socialPlatform;

}
