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
@Table(name = "auction")
public class AuctionEntity {
    // 경매 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ac_no;

    @Column
    private int ac_product_no;

    @Column(length = 5000)
    private String ac_product_content;

    @Column(length = 50)
    private String ac_start_price;

    @Column(length = 50)
    private String ac_now_price;

    @Column(length = 50)
    private String ac_instant_price;

    @Column
    private String ac_product_time;

    public AuctionEntity() {

    }
}
