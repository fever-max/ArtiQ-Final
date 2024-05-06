package com.artiq.back.auction;

import com.artiq.back.auction.entity.ArtDataEntity;
import com.artiq.back.auction.entity.AuctionEntity;

import lombok.Data;



@Data
public class LiveAuctionDTO {
    private final ArtDataEntity liveAuctionData;
    private final AuctionEntity liveAuctionInfo;

    public LiveAuctionDTO(ArtDataEntity liveAuctionData, AuctionEntity liveAuctionInfo) {
        this.liveAuctionData = liveAuctionData;
        this.liveAuctionInfo = liveAuctionInfo;
    }

}