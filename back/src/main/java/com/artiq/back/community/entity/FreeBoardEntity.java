package com.artiq.back.community.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "board")
public class FreeBoardEntity {
    // 자유게시판 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_number")
    private Long boardNumber;

    @Column(length = 50, name = "board_category")
    private String boardCategory;

    @Column(length = 50, name = "board_title")
    private String boardTitle;

    @Column(length = 2000, name = "board_content")
    private String boardContent;

    @Column(length = 50, name = "user_nickname")
    private String userNickname;

    @Column(length = 50, name = "user_email")
    private String userEmail;

    @Column(name = "board_date")
    private LocalDate boardDate;

    @Column(name = "board_view_count")
    private int boardViewCount;

    @Column(name = "board_up_count")
    private int boardUpCount;

    @Column(name = "board_down_count")
    private int boardDownCount;

    @Column(name = "board_comment_count")
    private int boardCommentCount;

}
