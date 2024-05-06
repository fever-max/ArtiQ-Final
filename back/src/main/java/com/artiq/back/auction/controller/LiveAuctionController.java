package com.artiq.back.auction.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.auction.LiveAuctionDTO;
import com.artiq.back.auction.entity.ArtDataEntity;
import com.artiq.back.auction.entity.AuctionEntity;
import com.artiq.back.auction.entity.BidEntity;
import com.artiq.back.auction.service.ArtDataService;
import com.artiq.back.auction.service.LiveAuctionService;
import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserPointEntity;
import com.artiq.back.user.entity.UserRankEntity;
import com.artiq.back.user.service.PointService;
import com.artiq.back.user.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RequiredArgsConstructor
@RestController
public class LiveAuctionController {
     private final LiveAuctionService liveAuctionService;
     private final ArtDataService artDataService;
     private final PointService pointService;
     private final UserService userService;
     private boolean isFirstTime = true; 


    //두개엔티티값을 DTO를 만들고 담아 전송
    @GetMapping("/liveAuction/getData")
    public ResponseEntity<LiveAuctionDTO> getAllAuctionData() {
    ArtDataEntity liveAuctionData = artDataService.findOneAuctionData();
    AuctionEntity liveAuctionInfo = liveAuctionService.findAuctionData();
    LiveAuctionDTO liveAuctionDTO = new LiveAuctionDTO(liveAuctionData, liveAuctionInfo);
    // 최초 실행 여부를 확인하여 한 번만 실행되도록 함
    if (isFirstTime) {
        liveAuctionService.createAuction();
        isFirstTime = false; // 최초 실행 후 상태 변경
    }
    return ResponseEntity.ok(liveAuctionDTO);
    }


    @PostMapping("/liveAuction/bid")
    public void saveBidUserInfo(@RequestBody BidEntity bidEntity) {
            liveAuctionService.saveBidData(bidEntity);
    }

    // 결제 컨트롤러
    @PostMapping("/liveAuction/pay")
    public ResponseEntity<String> pay(@RequestBody Map<String, String> requestData) {
        System.out.println("결제 컨트롤러 실행");
        String pointCertify = requestData.get("pointCertify");
        String userEmail = requestData.get("userEmail");
        String pointCharge = requestData.get("pointCharge");
        String pointPay = requestData.get("pointPay");
  
        UserPointEntity userPoint = UserPointEntity.builder()
                .pointRole("충전")
                .pointCertify((pointCertify))
                .userEmail(userEmail)
                .pointCharge(pointCharge)
                .pointPay(pointPay)
                .pointComment("실시간경매 충전 / " + pointPay + "원")
                .pointDate(LocalDateTime.now())
                .build();

        // 결제정보 db에 저장 서비스
        pointService.pointPayment(userPoint);

        // 리액트로 메시지 반환
        return ResponseEntity.ok("결제정보 저장 완료");
    }

    @GetMapping("/myPage/rank")
    public ResponseEntity<UserRankEntity> getUserRank(@RequestParam("userEmail") String userEmail) {
        UserRankEntity userRank = userService.findByUserRank(userEmail);
        return ResponseEntity.ok(userRank);
    }

    
    // 입찰시 금액차감
    @PostMapping("/liveAuction/point/bid")
    public ResponseEntity<String> 
    Variance(@RequestBody Map<String, String> requestData) {
        System.out.println("입찰 포인트 변동");
        String userEmail = requestData.get("userEmail");
        String pointCharge = requestData.get("pointCharge");

        System.out.println("pointCharge: " + pointCharge);
        System.out.println("userEmail: " + userEmail);

        UserPointEntity userPoint = UserPointEntity.builder()
                .pointRole("사용")
                .userEmail(userEmail)
                .pointCharge(pointCharge)
                .pointComment("실시간경매 입찰 사용" )
                .pointDate(LocalDateTime.now())
                .build();
        // 결제정보 db에 저장 서비스
        liveAuctionService.pointPayment(userPoint);

        // 리액트로 메시지 반환
        return ResponseEntity.ok("결제정보 저장 완료");
    }

    
    // 재입찰시 금액증감
    @PostMapping("/liveAuction/point/restore")
    public ResponseEntity<String> 
    restore(@RequestBody Map<String, String> requestData) {
        System.out.println("입찰 포인트 변동");
        String userEmail = requestData.get("userEmail");
        String pointCharge = requestData.get("pointCharge");


        UserPointEntity userPoint = UserPointEntity.builder()
                .pointRole("충전")
                .userEmail(userEmail)
                .pointCharge(pointCharge)
                .pointComment("실시간경매 입찰금 복구" )
                .pointDate(LocalDateTime.now())
                .build();

        // 결제정보 db에 저장 서비스
        liveAuctionService.pointRestore(userPoint);

        // 리액트로 메시지 반환
        return ResponseEntity.ok("결제정보 저장 완료");
    }

    @PostMapping("/liveAuction/rank")
    public ResponseEntity<UserRankEntity> getUserRank(@RequestBody UserEntity user) {

        // System.out.println("멤버쉽 컨트롤러: " + user.getUserEmail());

        // 멤버쉽 정보 받아옴
        UserRankEntity userRank = userService.findByUserRank(user.getUserEmail());

        return ResponseEntity.ok(userRank);
    }

}

