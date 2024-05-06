package com.artiq.back.user.dto;

import java.util.List;

import com.artiq.back.auction.entity.ArtDataEntity;
import com.artiq.back.auction.entity.BidEntity;

import lombok.Data;

@Data
public class UserMyAuction {
    private List<BidEntity> bidData;
    private List<ArtDataEntity> artData;
}
