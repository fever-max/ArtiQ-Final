package com.artiq.back.community.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "notice")
public class NoticeEntity {
    //공지사항 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_number")
    private Long noticeNumber;

    @Column(name = "notice_title")
    private String noticeTitle;

    @Column(name = "notice_content")
    private String noticeContent;

    @Column(name = "notice_date")
    private LocalDate noticeDate;

    @Column(name = "notice_view_count")
    private int noticeViewCount;

    @Column(length = 50, name = "notice_nickname")
    private String userNickname;

    @Column(length = 50, name = "notice_email")
    private String userEmail;

}
