package com.artiq.back.auction.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.artiq.back.auction.entity.AuctionEntity;
import com.artiq.back.auction.entity.BidEntity;
import com.artiq.back.auction.repository.ArtDataRepository;
import com.artiq.back.auction.repository.AuctionRepository;
import com.artiq.back.auction.repository.BidRepository;
import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserPointEntity;
import com.artiq.back.user.entity.UserRankEntity;
import com.artiq.back.user.repository.UserPointRepository;
import com.artiq.back.user.repository.UserRankRepository;
import com.artiq.back.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class LiveAuctionService {

  private final ArtDataRepository artDataRepository;
  private final BidRepository bidRepository;
  private final AuctionRepository auctionRepository;
  private final UserPointRepository userPointRepository; 
  private final UserRankRepository userRankRepository;
  private final UserRepository userRepository;
 
    public AuctionEntity findAuctionData() {
        return auctionRepository.findById(1).orElse(null);
    }

     public void createAuction() {
        AuctionEntity auctionEntity = new AuctionEntity();
        auctionEntity.setAc_product_no(22);
        auctionEntity.setAc_product_content("전통적인 한국화 기법인 수묵담채와 몰골법을 사용하여 그려진 미술품입니다. 이 작품은 한국의 아름다운 자연경관과 전통 문화를 현대적인 시각으로 풀어내었습니다.작품 속에는 자연의 아름다움과 정취가 담겨져 있습니다. 수묵 담채 기법을 통해 그려진 산수와 호수는 강인한 생명력과 고요한 아름다움을 함께 담고 있습니다. 또한, 몰골법을 활용한 작품 속 식물이나 동물들은 자연과의 조화를 상징하며, 전통과 현대의 만남을 시사합니다.");
        auctionEntity.setAc_start_price("1000");
        auctionEntity.setAc_now_price("1000");
        auctionEntity.setAc_product_time("2024-04-29T18:30:00");
        auctionEntity.setAc_instant_price("10000");

        auctionRepository.save(auctionEntity);
    }

    //입찰클릭시 정보저장 메소드
    public void saveBidData(BidEntity bidEntity) {
        Optional<BidEntity> optionalEntity = bidRepository.findByBidUserEmail(bidEntity.getBidUserEmail());
        
        if (optionalEntity.isPresent()) {
            BidEntity entity = optionalEntity.get();
            entity.setBidPrice(bidEntity.getBidPrice());
            entity.setBidTime(bidEntity.getBidTime());
            entity.setBidEndPrice(bidEntity.getBidEndPrice());
            entity.setBidEndTime(bidEntity.getBidEndTime());
            bidRepository.save(entity);
        } else {
            bidRepository.save(bidEntity);
        }
    }
    

    //입찰시 포인트 감소
     public ResponseEntity<String> pointPayment(UserPointEntity payInfo) {
        System.out.println("결제정보 저장 서비스");
        // 유저 테이블에서 db 검사
        Optional<UserEntity> userOptional = userRepository.findByUserEmail(payInfo.getUserEmail());

        // 존재하는 유저면 포인트 db에 저장
        if (userOptional.isPresent()) {
            System.out.println("존재하는 유저, db에 저장 진행");
            userPointRepository.save(payInfo);
            System.out.println("존재하는 유저, db에 저장 완료");
            // 멤버쉽 테이블도 포인트 반영
            Optional<UserRankEntity> userOptional2 = userRankRepository.findByUserEmail(payInfo.getUserEmail());
            if (userOptional2.isPresent()) {
                UserRankEntity rankEntity = userOptional2.get();
                int beforePoint = Integer.parseInt(rankEntity.getRankPoint());
                int afterPoint = Integer.parseInt(payInfo.getPointCharge());
                int addPoint = beforePoint - afterPoint;
                rankEntity.setRankPoint(String.valueOf(addPoint));
                userRankRepository.save(rankEntity);
                System.out.println("포인트 감소");
            }

            return ResponseEntity.ok().build();

        } else {
            // // 유저가 존재하지않으면 404에러
            return ResponseEntity.notFound().build();
        }
    }

    //재입찰시 포인트 증가
    public ResponseEntity<String> pointRestore(UserPointEntity payInfo) {
        System.out.println("결제정보 저장 서비스");
        // 유저 테이블에서 db 검사
        Optional<UserEntity> userOptional = userRepository.findByUserEmail(payInfo.getUserEmail());
      
        // 존재하는 유저면 포인트 db에 저장
        if (userOptional.isPresent()) {
            userPointRepository.save(payInfo);
            // 멤버쉽 테이블도 포인트 반영
            Optional<UserRankEntity> userOptional2 = userRankRepository.findByUserEmail(payInfo.getUserEmail());

            if (userOptional2.isPresent()) {
                
                UserRankEntity rankEntity = userOptional2.get();
                int beforePoint = Integer.parseInt(rankEntity.getRankPoint());
                int afterPoint = Integer.parseInt(payInfo.getPointCharge());
                int addPoint = beforePoint + afterPoint;
                rankEntity.setRankPoint(String.valueOf(addPoint));
                userRankRepository.save(rankEntity);
                System.out.println("포인트 감소");
            }

            return ResponseEntity.ok().build();

        } else {
            // // 유저가 존재하지않으면 404에러
            return ResponseEntity.notFound().build();
        }
    }




}

