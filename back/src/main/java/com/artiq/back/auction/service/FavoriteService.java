package com.artiq.back.auction.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.artiq.back.auction.entity.ArtDataEntity;
import com.artiq.back.auction.entity.ArtDataEntity2;
import com.artiq.back.auction.entity.AuctionFavoriteEntity;
import com.artiq.back.auction.entity.BidEntity;
import com.artiq.back.auction.repository.ArtDataRepository;
import com.artiq.back.auction.repository.ArtDataRepository2;
import com.artiq.back.auction.repository.BidRepository2;
import com.artiq.back.auction.repository.FavoriteRepository;
import com.artiq.back.config.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class FavoriteService {

    private final ArtDataRepository artDataRepository;
    private final ArtDataRepository2 artDataRepository2;
    private final BidRepository2 bidRepository2;
    private final JwtTokenProvider jwtTokenProvider;
    private final FavoriteRepository favoriteRepository;
    public BidEntity findUserBid(int acProductNo, String bidUserEmail) {
        Optional<BidEntity> bid = bidRepository2.findByAcProductNoAndBidUserEmail(acProductNo, bidUserEmail);
        return bid.orElse(null);
    }

    // 입찰 업데이트 로직
    public String updateBid(int bidId, BidEntity updatedBid) throws Exception {
        Optional<BidEntity> existingBid = bidRepository2.findById(bidId);
        if (!existingBid.isPresent()) {
            return "No bid found with the provided ID.";
        }

        BidEntity bid = existingBid.get();

        // 사용자 이메일이 일치하는지 확인
        if (!bid.getBidUserEmail().equals(updatedBid.getBidUserEmail())) {
            return "User email does not match.";
        }

        bid.setBidPrice(updatedBid.getBidPrice());
        bidRepository2.save(bid);
        return "OK";
    }

    // 입찰 삭제 로직
    public String deleteBid(int bidId, String userEmail) {
        Optional<BidEntity> existingBid = bidRepository2.findById(bidId);
        if (!existingBid.isPresent()) {
            return "No bid found with the provided ID.";
        }
        BidEntity bid = existingBid.get();

        // 삭제 요청한 사용자의 이메일이 입찰에 등록된 이메일과 일치하는지 확인
        if (!bid.getBidUserEmail().equals(userEmail)) {
            return "User email does not match.";
        }
        bidRepository2.delete(bid);
        return "OK";
    }

    //관심상품 등록
    public ResponseEntity<String> saveFavor(AuctionFavoriteEntity favorInfo){
       
        Optional<AuctionFavoriteEntity> af = favoriteRepository.findByFvUserEmailAndAcProductNo(favorInfo.getFvUserEmail(),favorInfo.getAcProductNo());
         if (!af.isPresent()) {
            favoriteRepository.save(favorInfo);
            return ResponseEntity.ok("삭제 성공");
         }
            return ResponseEntity.notFound().build();
         
        }

     @Transactional
     public ResponseEntity<String> deleteFavor(AuctionFavoriteEntity favorInfo) {
         Optional<AuctionFavoriteEntity> af = favoriteRepository.findByFvUserEmailAndAcProductNo(favorInfo.getFvUserEmail(), favorInfo.getAcProductNo());
         if (af.isPresent()) {
             favoriteRepository.delete(af.get());
             return ResponseEntity.ok("삭제 성공");
         } else {
             return ResponseEntity.notFound().build();
         }
     }

     public AuctionFavoriteEntity existFavor(AuctionFavoriteEntity favorInfo) {
        Optional<AuctionFavoriteEntity> af = favoriteRepository.findByFvUserEmailAndAcProductNo(favorInfo.getFvUserEmail(), favorInfo.getAcProductNo());
        if (af.isPresent()) {
          return af.get();
        }else{
            return null;
        }
    }



    public Map<String, Object> findLikeData(String fvUserEmail) {
        
        List<AuctionFavoriteEntity> favoriteEntities = favoriteRepository.findByFvUserEmail(fvUserEmail);
        List<Integer> productNos = favoriteEntities.stream().map(AuctionFavoriteEntity::getAcProductNo).collect(Collectors.toList());
        
        // 각각의 데이터 조회
        List<ArtDataEntity> artData = artDataRepository.findByArtIdIn(productNos);
        List<ArtDataEntity2> artData2 = artDataRepository2.findByArtId2In(productNos);

        // 데이터를 Map으로 묶어서 반환
        Map<String, Object> auctionDataMap = new HashMap<>();
        auctionDataMap.put("artData", artData);
        auctionDataMap.put("artData2", artData2);

        return auctionDataMap;
        }

}