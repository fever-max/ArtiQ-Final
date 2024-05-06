package com.artiq.back.auction.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "auction_favorite")
public class AuctionFavoriteEntity {

    
    //물품번호
    @Id
    @Column(name = "ac_product_no")
    private int acProductNo;
    
    @Column(name = "ac_fv_userEmail")
    private String fvUserEmail;
    
    //관심여부(상태) 1이면 관심등록된상태
    @Column(name = "ac_fv_status")
    private int favoriteStatus;

    public AuctionFavoriteEntity(){
        
    }
    
}
