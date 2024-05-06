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
@Table(name = "art_request")
public class RequestEntity {
    // 의뢰 테이블

    @Id
    @Column(length = 50, name = "re_order_no")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reOrderNo;

    @Column(length = 50, name = "re_genre")
    private String reGenre;

    // 의뢰인 이메일
    @Column(length = 50, name = "req_user_email")
    private String reqUserEmail;

    @Column(length = 1000, name = "re_field")
    private String reField;

    @Column(length = 50, name = "user_name")
    private String userName;

    // 감정사 이메일
    @Column(length = 50, name = "user_email")
    private String userEmail;

    @Column(length = 50, name = "re_artwork")
    private String reArtwork;

    @Column(length = 50, name = "re_artist")
    private String reArtist;

    @Column(length = 100, name = "re_size")
    private String reSize;

    @Column(length = 50, name = "re_product_year")
    private String reProductYear;

    @Column(length = 50, name = "original_file_name")
    private String originalFileName;

    @Column(length = 1000, name = "save_file_name")
    private String saveFileName;

    @Column(length = 1000, name = "image_url")
    private String imageURL;

    @Column(length = 5000, name = "re_details")
    private String reDetails;

    @Column(length = 50, name = "ap_date")
    private LocalDate apDate;

    @Column(length = 5000, name = "ap_ok_message")
    private String apOkMessage;
}
