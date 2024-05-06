package com.artiq.back.community.entity;

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
@Table(name = "vote")
public class VoteEntity {
    // 투표 테이블

    @Id
    @Column(name = "vote_number")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long voteNumber;

    @Column(name = "board_number")
    private Long boardNumber;

    @Column(name = "user_email")
    private String userEmail;

}
