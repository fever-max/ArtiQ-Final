package com.artiq.back.auction.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "Date2")
public class ArtDataEntity2 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "art_Id2")
    private Integer artId2;

    private Integer min_Mo;
    private Integer bid_Amt;

    @Column(length = 4000)
    private String description_Dd;

    @Column(name = "basicstart_time", nullable = false)
    private LocalDateTime basicStartTime;

    @Column(name = "basicend_time", nullable = false)
    private LocalDateTime basicEndTime;

    @Column(name = "is_processed", nullable = false)
    private boolean isProcessed = false; // 기본값을 false로 설정

    public boolean getIsProcessed() {
        return isProcessed;
    }

    public void setIsProcessed(boolean isProcessed) {
        this.isProcessed = isProcessed;
    }

}
