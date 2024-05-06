package com.artiq.back.matching.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import com.artiq.back.config.security.JwtTokenProvider;
import com.artiq.back.matching.entity.RequestEntity;
import com.artiq.back.matching.entity.RequestNOEntity;
import com.artiq.back.matching.entity.RequestOKEntity;
import com.artiq.back.matching.service.MyCommissionService;
import com.artiq.back.user.entity.UserEntity;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class MyCommissionController {

    private final JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private MyCommissionService myCommissionService;

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
        // JWT 토큰이 없는 경우
        if (jwtToken == null) {
            throw new IllegalArgumentException("JWT token not found in cookie");
        }
        // JWT 토큰 유효성 검사
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            throw new IllegalArgumentException("Invalid token");
        }
        return jwtToken;
    }

    // 받은 의뢰 신청 테이블반환 컨트롤러
    @GetMapping("/myPage/myCommissionExpert1")
    public ResponseEntity<RequestEntity> findMyCommissionExpert1(HttpServletRequest request) {
        System.out.println("받은 의뢰 신청 테이블 반환 컨트롤러");

        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        // 받은 의뢰 신청 테이블 받아옴
        RequestEntity requestEntity = myCommissionService.getMyCommissionExpert1(userEmail);

        return ResponseEntity.ok(requestEntity);
    }

    // 받은 의뢰 승인 테이블반환 컨트롤러
    @GetMapping("/myPage/myCommissionExpert2")
    public ResponseEntity<RequestOKEntity> findMyCommissionExpert2(HttpServletRequest request) {
        System.out.println("받은 의뢰 신청 승인 테이블 반환 컨트롤러");

        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        // 받은 의뢰 신청 테이블 받아옴
        RequestOKEntity requestOKEntity = myCommissionService.getMyCommissionExpert2(userEmail);

        return ResponseEntity.ok(requestOKEntity);
    }

    // 받은 의뢰 거절 테이블반환 컨트롤러
    @GetMapping("/myPage/myCommissionExpert3")
    public ResponseEntity<RequestNOEntity> findMyCommissionExpert3(HttpServletRequest request) {
        System.out.println("받은 의뢰 신청 거절 테이블 반환 컨트롤러");

        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        // 감정사 신청 테이블 받아옴
        RequestNOEntity requestNOEntity = myCommissionService.getMyCommissionExpert3(userEmail);

        return ResponseEntity.ok(requestNOEntity);
    }

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // 받은 의뢰 승인 컨트롤러
    @PostMapping("/commissionExpert/ok")
    public ResponseEntity<String> postExpertData(@RequestBody RequestOKEntity requestOKEntity) {
        System.out.println("받은 의뢰 승인 컨트롤러 실행");

        System.out.println("승인이메일: " + requestOKEntity.getUserEmail());
        System.out.println("승인사유: " + requestOKEntity.getApOkMessage());

        try {

            myCommissionService.saveCommissionRequestOk(requestOKEntity);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("승인 실패 " + e.getMessage());
        }
    }

    // 받은 의뢰 거절 컨트롤러
    @PostMapping("/commissionExpert/no")
    public ResponseEntity<String> rejectExpertData(@RequestBody RequestNOEntity requestNOEntity) {
        System.out.println("받은 의뢰 거절 컨트롤러 실행");

        System.out.println("거절이메일: " + requestNOEntity.getUserEmail());
        System.out.println("거절사유: " + requestNOEntity.getApNoMessage());
        try {

            myCommissionService.saveCommissionRequestNo(requestNOEntity);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("거절 실패 " + e.getMessage());
        }
    }

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // 보낸 의뢰 신청 테이블반환 컨트롤러
    @GetMapping("/myPage/myCommission1")
    public ResponseEntity<RequestEntity> findMyCommission1(HttpServletRequest request) {
        System.out.println("보낸 의뢰 신청 테이블 반환 컨트롤러");

        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        // 보낸 의뢰 신청 테이블 받아옴
        RequestEntity requestEntity = myCommissionService.getMyCommission1(userEmail);

        return ResponseEntity.ok(requestEntity);
    }

    // 보낸 의뢰 승인 테이블반환 컨트롤러
    @GetMapping("/myPage/myCommission2")
    public ResponseEntity<RequestOKEntity> findMyCommission2(HttpServletRequest request) {
        System.out.println("보낸 의뢰 신청 승인 테이블 반환 컨트롤러");

        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        // 보낸 의뢰 신청 테이블 받아옴
        RequestOKEntity requestOKEntity = myCommissionService.getMyCommission2(userEmail);

        return ResponseEntity.ok(requestOKEntity);
    }

    // 보낸 의뢰 거절 테이블반환 컨트롤러
    @GetMapping("/myPage/myCommission3")
    public ResponseEntity<RequestNOEntity> findMyCommission3(HttpServletRequest request) {
        System.out.println("보낸 의뢰 신청 거절 테이블 반환 컨트롤러");

        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        // 감정사 신청 테이블 받아옴
        RequestNOEntity requestNOEntity = myCommissionService.getMyCommission3(userEmail);

        return ResponseEntity.ok(requestNOEntity);
    }

      @PostMapping("/myPage/myCommissionCancel1")
    public ResponseEntity<String> myCommissionCancel1(@RequestBody UserEntity user) {
        System.out.println("보낸 의뢰 신청 테이블 삭제 컨트롤러");

        // 보낸 의뢰 신청 테이블 삭제 서비스 호출
        ResponseEntity<String> responseEntity = myCommissionService.myCommissionCancel1(user.getUserEmail());

        return responseEntity;
    }

    @PostMapping("/myPage/myCommissionCancel2")
    public ResponseEntity<String> myCommissionCancel2(@RequestBody UserEntity user) {
        System.out.println("보낸 의뢰 철회 컨트롤러");

        // 보낸 의뢰 신청 테이블 삭제 서비스 호출
        ResponseEntity<String> responseEntity = myCommissionService.myCommissionCancel2(user.getUserEmail());

        return responseEntity;
    }

    @PostMapping("/myPage/myCommissionCancel3")
    public ResponseEntity<String> myCommissionCancel3(@RequestBody UserEntity user) {
        System.out.println("보낸 의뢰 철회 컨트롤러");

        // 보낸 의뢰 신청 테이블 삭제 서비스 호출
        ResponseEntity<String> responseEntity = myCommissionService.myCommissionCancel3(user.getUserEmail());

        return responseEntity;
    } 
}
