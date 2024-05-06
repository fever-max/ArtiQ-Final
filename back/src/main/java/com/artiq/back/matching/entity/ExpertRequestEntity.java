package com.artiq.back.matching.entity;

import java.time.LocalDate;

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

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "art_appraise_re")
public class ExpertRequestEntity {

    // 감정사 신청 테이블
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 50, name = "ap_no")
    private int apNo;

    @Column(length = 50, name = "user_name")
    private String userName;

    @Column(length = 50, name = "user_email")
    private String userEmail;

    @Column(length = 50, name = "original_file_name")
    private String originalFileName;

    @Column(length = 1000, name = "save_file_name")
    private String saveFileName;

    @Column(length = 1000, name = "image_url")
    private String imageURL;

    @Column(length = 50, name = "file_size")
    private long fileSize;

    @Column(length = 500, name = "re_field")
    private String reField;

    @Column(length = 50, name = "re_genre1")
    private String reGenre1;

    @Column(length = 50, name = "re_genre2")
    private String reGenre2;

    @Column(length = 50, name = "re_genre3")
    private String reGenre3;

    @Column(length = 50, name = "re_genre4")
    private String reGenre4;

    @Column(length = 50, name = "re_genre5")
    private String reGenre5;

    @Column(length = 100, name = "ap_career")
    private String apCareer;

    @Column(length = 5000, name = "ap_message")
    private String apMessage;

    @Column(name = "ap_date")
    private LocalDate apDate;
}
