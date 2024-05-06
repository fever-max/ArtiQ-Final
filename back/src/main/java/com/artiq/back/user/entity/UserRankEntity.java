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
@Table(name = "user_rank")
public class UserRankEntity {

    // 유저 등급 테이블
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rank_no")
    private Long rankNo;

    @Column(length = 50, name = "user_email", unique = true)
    private String userEmail;

    @Column(length = 50, name = "rank_level")
    private String rankLevel;

    @Column(length = 50, name = "rank_point")
    private String rankPoint;

}
