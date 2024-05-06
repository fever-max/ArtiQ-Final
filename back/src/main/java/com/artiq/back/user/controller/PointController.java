package com.artiq.back.user.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserPointEntity;
import com.artiq.back.user.service.PointService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/user/myPage/point")
public class PointController {

    private final PointService pointService;

    // 결제 컨트롤러
    @PostMapping("/pay")
    public ResponseEntity<String> pay(@RequestBody UserPointEntity requestData) {
        System.out.println("결제 컨트롤러 실행");
        String pointCertify = requestData.getPointCertify();
        String userEmail = requestData.getUserEmail();
        String pointCharge = requestData.getPointCharge();
        String pointPay = requestData.getPointPay();

        // System.out.println("pointCertify: " + pointCertify);
        // System.out.println("pointCharge: " + pointCharge);
        // System.out.println("userEmail: " + userEmail);

        UserPointEntity userPoint = UserPointEntity.builder()
                .pointRole("충전")
                .pointCertify((pointCertify))
                .userEmail(userEmail)
                .pointCharge(pointCharge)
                .pointPay(pointPay)
                .pointComment("마이페이지 충전 / " + pointPay + "원")
                .pointDate(LocalDateTime.now())
                .build();

        // 결제정보 db에 저장 서비스
        pointService.pointPayment(userPoint);

        // 리액트로 메시지 반환
        return ResponseEntity.ok("결제정보 저장 완료");
    }

    // 결제 테이블 반환 컨트롤러
    @PostMapping("/info")
    public ResponseEntity<List<UserPointEntity>> getUserPointTable(@RequestBody UserEntity user) {
        System.out.println("포인트 테이블 컨트롤러: " + user.getUserEmail());
        // 유저 포인트 테이블 반환 서비스 호출
        ResponseEntity<List<UserPointEntity>> response = pointService.findByUserPointTable(user.getUserEmail());
        // 서비스에서 반환된 응답을 그대로 반환
        return response;
    }

}
