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
@Table(name = "question")
public class QuestionEntity {
    // 질문게시판 테이블
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_number")
    private Long questionNumber;

    @Column(name = "question_category")
    private String questionCategory;

    @Column(length = 50, name = "question_title")
    private String questionTitle;

    @Column(length = 2000, name = "question_content")
    private String questionContent;

    @Column(length = 50, name = "user_nickname")
    private String userNickname;

    @Column(length = 50, name = "user_email")
    private String userEmail;

    @Column(name = "question_date")
    private LocalDate questionDate;

    @Column(name = "question_view_count")
    private int questionViewCount;

    @Column(name = "question_answer_count")
    private int questionAnswerCount;
    
}
