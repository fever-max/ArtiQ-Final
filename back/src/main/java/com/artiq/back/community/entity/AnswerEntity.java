package com.artiq.back.community.entity;

import java.time.LocalDate;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "answer")
public class AnswerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_number")
    private int answerNumber;

    @Column(length = 50, name = "user_email")
    private String userEmail;

    @Column(length = 50, name = "user_nickname")
    private String userNickname;

    @Column(length = 500, name = "answer_content")
    private String answerContent;

    @Column(name = "answer_date")
    private LocalDate answerDate;

    @Column(name = "question_number")
    private int questionNumber;

    @Column(nullable = false)
    private boolean isAccepted;
    
}
