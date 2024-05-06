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
@Table(name = "comment")
public class CommentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_number")
    private int commentNumber;

    @Column(length = 50, name = "user_email")
    private String userEmail;

    @Column(length = 50, name = "user_nickname")
    private String userNickname;

    @Column(length = 500, name = "comment_content")
    private String commentContent;

    @Column(name = "comment_date")
    private LocalDate commentDate;

    @Column(name = "board_number")
    private int boardNumber;

}
