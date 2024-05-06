package com.artiq.back.auction.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.artiq.back.auction.entity.ArtDataEntity;
import com.artiq.back.auction.entity.ArtDataEntity2;
import com.artiq.back.auction.entity.BidEntity;
import com.artiq.back.auction.repository.ArtDataRepository;
import com.artiq.back.auction.repository.ArtDataRepository2;
import com.artiq.back.auction.repository.BidRepository2;
import com.artiq.back.config.security.JwtTokenProvider;

import java.util.Arrays;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@Service
public class BasicAuctionService {

    private final ArtDataRepository artDataRepository;
    private final ArtDataRepository2 artDataRepository2;
    private final BidRepository2 bidRepository2;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public BasicAuctionService(ArtDataRepository artDataRepository, ArtDataRepository2 artDataRepository2, BidRepository2 bidRepository2,JwtTokenProvider jwtTokenProvider) {
        this.artDataRepository = artDataRepository;
        this.artDataRepository2 = artDataRepository2;
        this.bidRepository2 = bidRepository2;
        this.jwtTokenProvider=jwtTokenProvider;
    }

    public Map<String, Object> findAllAuctionData() {
        List<ArtDataEntity> artData = artDataRepository.findAll();
        List<ArtDataEntity2> artData2 = artDataRepository2.findAll();

        Map<String, Object> auctionDataMap = new HashMap<>();
        auctionDataMap.put("artData", artData);
        auctionDataMap.put("artData2", artData2);

        return auctionDataMap;
    }

    public Map<String, Object> findArtDataById(Integer id) {
        Optional<ArtDataEntity> artDataOpt = artDataRepository.findById(id);
        List<ArtDataEntity2> artData2List = artDataRepository2.findByArtId2(id);
    
          // id를 List에 넣어서 countByAcProductNoIn 메서드에 전달
             List<Integer> ids = Arrays.asList(id);
             int bidCount = bidRepository2.countByAcProductNoIn(ids); // 입찰자 수 조회
    
        Map<String, Object> result = new HashMap<>();
        artDataOpt.ifPresent(artData -> {
            result.put("artData", artData);
            result.put("artData2", artData2List);
            result.put("bidCount", bidCount); // 결과 맵에 입찰자 수 추가
        });
    
        return result;
    }

    public String saveBid(BidEntity bid) throws Exception {
        ArtDataEntity2 artData2 = artDataRepository2.findById(bid.getAcProductNo())
            .orElseThrow(() -> new Exception("Auction data not found for product ID: " + bid.getAcProductNo()));
    
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(artData2.getBasicStartTime())) {
            throw new Exception("Auction for product ID " + bid.getAcProductNo() + " has not started yet.");
        }
        if (now.isAfter(artData2.getBasicEndTime())) {
            throw new Exception("Auction for product ID " + bid.getAcProductNo() + " has already ended.");
        }
    
        if (new BigDecimal(bid.getBidPrice()).compareTo(new BigDecimal(artData2.getMin_Mo())) < 0) {
            throw new Exception("Bid amount $" + bid.getBidPrice() + " is less than the minimum required bid amount of $" + artData2.getMin_Mo() + ".");
        }
    
        bidRepository2.save(bid);
        return "Bid placed successfully";
    }

    public String validateBidConditions(BidEntity bid) {
        ArtDataEntity2 artData2 = artDataRepository2.findById(bid.getAcProductNo()).orElse(null);
        if (artData2 == null) return "No auction data found for the product.";
    
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(artData2.getBasicStartTime()) || now.isAfter(artData2.getBasicEndTime())) {
            return "This auction is not active.";
        }
        
        if (new BigDecimal(bid.getBidPrice()).compareTo(new BigDecimal(artData2.getMin_Mo())) < 0) {
            return "Bid amount is less than the minimum bid amount.";
        }
        
        return "OK";
    }
    public BidEntity findUserBid(int acProductNo, String bidUserEmail) {
        Optional<BidEntity> bid = bidRepository2.findByAcProductNoAndBidUserEmail(acProductNo, bidUserEmail);
        return bid.orElse(null);
    }

 
}