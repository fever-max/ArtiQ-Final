package com.artiq.back.auction.controller;

import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.artiq.back.auction.entity.ArtDataEntity;
import com.artiq.back.auction.entity.ArtDataEntity2;
import com.artiq.back.auction.entity.BasicMessageEntity;
import com.artiq.back.auction.entity.BidEntity;
import com.artiq.back.auction.repository.ArtDataRepository2;
import com.artiq.back.auction.repository.BasicMessageRepository;
import com.artiq.back.auction.repository.BasicPointRepository;
import com.artiq.back.auction.repository.BasicRankRepository;
import com.artiq.back.auction.repository.BidRepository2;
import com.artiq.back.auction.service.BasicAuctionService;
import com.artiq.back.config.security.JwtTokenProvider;
import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserPointEntity;
import com.artiq.back.user.entity.UserRankEntity;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
public class BasicAuctionController {

    private final BasicAuctionService artDataService;
    private final JwtTokenProvider jwtTokenProvider;
    private final BidRepository2 bidRepository2;
    private final BasicRankRepository basicRankRepository;
    private final BasicPointRepository basicPonitRepository;
    private final ArtDataRepository2 artDataRepository2;
    private final BasicMessageRepository basicMessageRepository;

    @Autowired
    public BasicAuctionController(BasicAuctionService artDataService, JwtTokenProvider jwtTokenProvider,
            BasicRankRepository basicRankRepository, BasicPointRepository basicPonitRepository,
            BidRepository2 bidRepository2, ArtDataRepository2 artDataRepository2,
            BasicMessageRepository basicMessageRepository) {
        this.artDataService = artDataService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.basicRankRepository = basicRankRepository;
        this.basicPonitRepository = basicPonitRepository;
        this.bidRepository2 = bidRepository2;
        this.artDataRepository2 = artDataRepository2;
        this.basicMessageRepository = basicMessageRepository;
    }

    @GetMapping("/rankPoint/{userEmail}")
    public ResponseEntity<?> getRankPointByUserEmail(@PathVariable String userEmail) {
        Optional<UserRankEntity> userRank = basicRankRepository.findByUserEmail(userEmail);
        if (!userRank.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("rankPoint", userRank.get().getRankPoint());
        return ResponseEntity.ok(response);
    }

    @Transactional
    @PostMapping("/bid")
    public ResponseEntity<String> placeBid(@RequestBody BidEntity bid) {
        try {
            // 사용자 포인트 조회
            Optional<UserRankEntity> optionalrankPoint = basicRankRepository.findByUserEmail(bid.getBidUserEmail());
            if (!optionalrankPoint.isPresent()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }

            UserRankEntity userRank = optionalrankPoint.get();
            int bidAmount = Integer.parseInt(bid.getBidPrice());
            int currentPoints = Integer.parseInt(userRank.getRankPoint());

            System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@");
            System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@");
            System.out.println(currentPoints);
            System.out.println(currentPoints);

            // 포인트 검증
            if (currentPoints < bidAmount) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient points");
            }

            // 입찰 조건 검증
            String validationResponse = artDataService.validateBidConditions(bid);
            if (!validationResponse.equals("OK")) {
                return ResponseEntity.badRequest().body(validationResponse);
            }
            // 포인트 감소 및 저장
            int newPoints = currentPoints - bidAmount;
            userRank.setRankPoint(String.valueOf(newPoints));
            basicRankRepository.save(userRank);
            // 입찰 정보 저장
            artDataService.saveBid(bid);
            // 사용 금액 저장
            UserPointEntity userPoint = UserPointEntity.builder()
                    .pointRole("사용")
                    .pointCertify(String.valueOf(bid.getAcProductNo()))
                    .userEmail(bid.getBidUserEmail())
                    .pointCharge(bid.getBidPrice())
                    // .pointPay(bid.getBidPrice())
                    .pointComment("일반경매 입찰 사용")
                    .pointDate(LocalDateTime.now())
                    .build();
            basicPonitRepository.save(userPoint);
            // 응답에 사용자 포인트 정보 추가
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bid placed successfully");
            response.put("userRankPoint", userRank.getRankPoint());
            return ResponseEntity.ok().body(new ObjectMapper().writeValueAsString(response));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error placing bid: " + e.getMessage());
        }
    }

    @Transactional
    @PutMapping("/updateBid")
    public ResponseEntity<String> updateBid(@RequestBody BidEntity bidRequest) {
        try {
            // 입찰 정보 조회
            int acProductNo = bidRequest.getAcProductNo();
            String bidUserEmail = bidRequest.getBidUserEmail();
            BidEntity existingBid = bidRepository2.findByAcProductNoAndBidUserEmail(acProductNo, bidUserEmail)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bid not found"));

            // 사용자 포인트 조회
            UserRankEntity userRank = basicRankRepository.findByUserEmail(bidUserEmail)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            int currentPoints = Integer.parseInt(userRank.getRankPoint()); // 사용자 현재 포인트
            int oldBidAmount = Integer.parseInt(existingBid.getBidPrice()); // 기존 입찰 금액
            int newBidAmount = Integer.parseInt(bidRequest.getBidPrice()); // 새 입찰 금액
            int pointsDifference = newBidAmount - oldBidAmount; // 포인트 차이
            int updatedPoints = currentPoints - pointsDifference; // 업데이트된 포인트
            System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            System.out.println(acProductNo);
            System.out.println(bidUserEmail);
            System.out.println(newBidAmount);
            System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@");

            if (updatedPoints < 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient points after update.");
            }

            userRank.setRankPoint(String.valueOf(updatedPoints));
            basicRankRepository.save(userRank);

            existingBid.setBidPrice(String.valueOf(newBidAmount));
            bidRepository2.save(existingBid);

            // 포인트 사용 내역 업데이트
            String pointCertify = String.valueOf(acProductNo); // productId를 문자열로 변환
            String userEmail = bidUserEmail; // 입찰 정보에서 가져온 이메일을 UserPointEntity에 맞게 변수명 변경
            Optional<UserPointEntity> userPointOpt = basicPonitRepository.findByUserEmailAndPointCertify(userEmail,
                    pointCertify);

            UserPointEntity userPoint = userPointOpt.orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User point record not found"));

            userPoint.setPointCharge(String.valueOf(newBidAmount));
            // userPoint.setPointPay(String.valueOf(newBidAmount));
            basicPonitRepository.save(userPoint);

            // 응답 구성
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bid updated successfully");
            response.put("userRankPoint", userRank.getRankPoint());
            return ResponseEntity.ok().body(new ObjectMapper().writeValueAsString(response));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating bid: " + e.getMessage());
        }
    }

    @Transactional
    @DeleteMapping("/deletebid")
    public ResponseEntity<String> deleteBid(@RequestBody BidEntity bidRequest) {
        try {
            // 입찰 정보 조회
            BidEntity existingBid = bidRepository2
                    .findByAcProductNoAndBidUserEmail(bidRequest.getAcProductNo(), bidRequest.getBidUserEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bid not found"));

            // 사용자 포인트 조회
            UserRankEntity userRank = basicRankRepository.findByUserEmail(bidRequest.getBidUserEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            // 포인트 반환 계산
            int bidAmount = Math.abs(Integer.parseInt(existingBid.getBidPrice())); // 확실히 양수로 변환
            int currentPoints = Integer.parseInt(userRank.getRankPoint());
            int updatedPoints = currentPoints + bidAmount;
            System.out.println("Refund Amount: " + bidAmount); // 로그 출력

            // 포인트 업데이트 및 저장
            userRank.setRankPoint(String.valueOf(updatedPoints));
            basicRankRepository.save(userRank);

            // 포인트 반환 내역 추가
            UserPointEntity refundPoint = new UserPointEntity();
            refundPoint.setPointRole("반환");
            refundPoint.setPointCertify(String.valueOf(bidRequest.getAcProductNo()));
            refundPoint.setUserEmail(bidRequest.getBidUserEmail());
            refundPoint.setPointCharge(String.valueOf(bidAmount));
            refundPoint.setPointPay("0"); // 실제 지불 없음
            refundPoint.setPointComment("경매 입찰 취소 반환");
            refundPoint.setPointDate(LocalDateTime.now());
            basicPonitRepository.save(refundPoint);

            // 입찰 정보 삭제
            bidRepository2.delete(existingBid);

            // 메시지 구분
            Map<String, Object> response = new HashMap<>();
            response.put("message", "삭제 완료! +" + bidAmount + " points 환급.");
            response.put("updatedRankPoint", userRank.getRankPoint());
            return ResponseEntity.ok().body(new ObjectMapper().writeValueAsString(response));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting bid: " + e.getMessage());
        }
    }

    @PostMapping("/bids/{id}")
    public ResponseEntity<?> getUserBid(@PathVariable("id") int acProductNo, @RequestBody Map<String, String> body) {
        String bidUserEmail = body.get("bidUserEmail");
        try {
            BidEntity bid = artDataService.findUserBid(acProductNo, bidUserEmail);
            System.out.println("Fetched bid: " + bid);
            if (bid != null) {
                return ResponseEntity.ok(bid);
            } else {
                return ResponseEntity.noContent().build();
            }
        } catch (Exception e) {
            System.out.println("Error retrieving bid: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error retrieving bid: " + e.getMessage());
        }
    }

    @GetMapping("/basicAuction")
    public ResponseEntity<Map<String, Object>> getAllAuctionData() {
        Map<String, Object> auctionData = artDataService.findAllAuctionData();
        return ResponseEntity.ok(auctionData);
    }

    @GetMapping("/basicAuctionDetail/{id}")
    public ResponseEntity<Map<String, Object>> getArtDataById(@PathVariable Integer id) {
        Map<String, Object> artDataWithRelated = artDataService.findArtDataById(id);

        if (artDataWithRelated.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(artDataWithRelated);
    }

    @GetMapping("/getEmail")
    public ResponseEntity<Map<String, Object>> getUserEmail(HttpServletRequest request) {

        // 쿠키에서 토큰 갖고옴
        String jwtToken = getUserJwtToken(request);
        Map<String, Object> response = new HashMap<>();

        // 토큰 없음
        if (jwtToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "JWT token is missing"));
        }
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        response.put("userEmail", userEmail);
        return ResponseEntity.ok(response);

    }

    private String getUserJwtToken(HttpServletRequest request) {
        String jwtToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("jwtToken")) {
                    jwtToken = cookie.getValue();
                    break;
                }
            }
        }
        return jwtToken;
    }

    @Transactional
    @Scheduled(cron = "0 * * * * *") // 매 분 실행
    public void processFinishedAuctions() {
        LocalDateTime adjustedNow = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).plusHours(9).toLocalDateTime();
        List<ArtDataEntity2> finishedAuctions = artDataRepository2
                .findByBasicEndTimeBeforeAndIsProcessedFalse(adjustedNow);

        for (ArtDataEntity2 auction : finishedAuctions) {
            Optional<BidEntity> highestBidOpt = bidRepository2
                    .findFirstByAcProductNoOrderByBidPriceDesc(auction.getArtId2());
            highestBidOpt.ifPresent(highestBid -> {
                finalizeAuction(highestBid, auction);
                auction.setIsProcessed(true);
                artDataRepository2.save(auction);
            });
        }
    }

    private void finalizeAuction(BidEntity highestBid, ArtDataEntity2 auction) {
        highestBid.setBidEndPrice(highestBid.getBidPrice());
        highestBid.setBidEndTime(auction.getBasicEndTime());
        bidRepository2.save(highestBid);

        List<BidEntity> losingBids = bidRepository2.findByAcProductNoAndBidUserEmailNot(auction.getArtId2(),
                highestBid.getBidUserEmail());
        for (BidEntity losingBid : losingBids) {
            UserRankEntity userRank = basicRankRepository.findByUserEmail(losingBid.getBidUserEmail()).orElse(null);
            if (userRank != null) {
                int refundAmount = Integer.parseInt(losingBid.getBidPrice());
                int updatedPoints = Integer.parseInt(userRank.getRankPoint()) + refundAmount;
                userRank.setRankPoint(String.valueOf(updatedPoints));
                basicRankRepository.save(userRank);

                // 포인트 반환 내역을 UserPointEntity에 기록
                UserPointEntity refundPoint = new UserPointEntity();
                refundPoint.setPointRole("반환");
                refundPoint.setPointCertify(String.valueOf(auction.getArtId2()));
                refundPoint.setUserEmail(losingBid.getBidUserEmail());
                refundPoint.setPointCharge(String.valueOf(refundAmount)); // 부호 없이 양수 금액 저장
                refundPoint.setPointPay("0"); // 실제 지불 없음
                refundPoint.setPointComment("경매 입찰 포인트 환급");
                refundPoint.setPointDate(LocalDateTime.now());
                basicPonitRepository.save(refundPoint);
            }
            sendNotification(losingBid.getBidUserEmail(), auction.getArtId2() + "번 물품을 낙찰 못함. 포인트 환급해줬음.");
        }
        sendNotification(highestBid.getBidUserEmail(), auction.getArtId2() + "번 물품을 낙찰했음. 배송 절차를 진행하세요.");
    }

    private void sendNotification(String userEmail, String message) {
        BasicMessageEntity notification = new BasicMessageEntity();
        notification.setUserEmail(userEmail);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setTimestamp(LocalDateTime.now());
        basicMessageRepository.save(notification);
    }

    @PostMapping("/notifications/unread")
    public ResponseEntity<List<BasicMessageEntity>> getUnreadNotifications(
            @RequestBody Map<String, String> requestBody) {

        String userEmail = requestBody.get("userEmail");
        List<BasicMessageEntity> notifications = basicMessageRepository.findByUserEmailAndIsReadFalse(userEmail);
        System.out.println("@@@@@@@@@@@@@@@@@@@@@@@");
        System.out.println("@@@@@@@@@@@@@@@@@@@@@@@");
        System.out.println(notifications);
        System.out.println("@@@@@@@@@@@@@@@@@@@@@@@");
        System.out.println("@@@@@@@@@@@@@@@@@@@@@@@");
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/notifications/mark-read/{id}")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Integer id) {
        BasicMessageEntity notification = basicMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        basicMessageRepository.save(notification);
        return ResponseEntity.ok().build();
    }

}
