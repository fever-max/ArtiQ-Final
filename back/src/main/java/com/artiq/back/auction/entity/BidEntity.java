package com.artiq.back.auction.entity;

import java.time.LocalDate;
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
@Table(name = "auction_bids")
public class BidEntity {
    // 입찰 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bid_no;

    @Column(name = "ac_product_no")
    private int acProductNo;

    @Column(name = "bid_user_email")
    private String bidUserEmail;

    @Column(name = "bid_price")
    private String bidPrice;  // 입찰 금액을 String 타입으로 저장

    
    @Column(name = "bid_time")
    private LocalDateTime bidTime;


    @Column(name = "bid_end_price", length = 50)
    private String bidEndPrice;

    @Column(name = "bid_end_time")
    private LocalDateTime bidEndTime;

    

    public BidEntity() {

    }

}