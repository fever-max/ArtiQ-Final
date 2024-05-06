package com.artiq.back.user.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.config.security.JwtTokenProvider;
import com.artiq.back.matching.entity.ExpertRequestEntity;
import com.artiq.back.matching.entity.ExpertRequestEntityNo;
import com.artiq.back.matching.entity.ExpertRequestEntityOk;
import com.artiq.back.user.dto.UserMyAuction;
import com.artiq.back.user.dto.UserUpdateRequest;
import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserRankEntity;
import com.artiq.back.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    // jwt 닉네임 요청 컨트롤러
    @GetMapping("/nickname")
    public ResponseEntity<String> getUserNickname(HttpServletRequest request) {
        // 쿠키에서 JWT 토큰 가져오기
        String jwtToken = getUserJwtToken(request);
        // System.out.println("jwtToken:" + jwtToken);
        // JWT 토큰에서 닉네임 추출
        String nickname = jwtTokenProvider.getUserNickname(jwtToken);
        if (nickname == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nickname not found");
        }

        // Authentication 객체를 가져옴
        Authentication test = SecurityContextHolder.getContext().getAuthentication();
        if (test != null && test.isAuthenticated()) {
            // 사용자의 권한 정보 확인
            System.out.println("로그인 후 사용자의 권한: " + test.getAuthorities());
        }
        return ResponseEntity.ok(nickname);
    }

    // 유저 전체 정보 갖고오기
    @GetMapping("/myPage/userInfo")
    public ResponseEntity<UserEntity> getUserInfos(HttpServletRequest request) {

        // 쿠키에서 JWT 토큰 가져오기
        String jwtToken = getUserJwtToken(request);
        // JWT 토큰에서 이메일 추출
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);
        System.out.println("이메일: " + userEmail);
        UserEntity userEntity = userService.findByUserInfos(userEmail);

        return ResponseEntity.ok(userEntity);
    }

    // 유저 정보 업데이트 함수
    @PutMapping("/myPage/update")
    public ResponseEntity<String> updateUser(@RequestBody UserUpdateRequest request) {

        String userEmail = request.getUserEmail();
        Map<String, String> fields = request.getFields();

        try {
            userService.updateUser(userEmail, fields);
            return ResponseEntity.ok("User information updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user information: " + e.getMessage());
        }
    }

    // 주소변경 컨트롤러
    @PutMapping("/myPage/updateAddr")
    public ResponseEntity<String> updateUserAddress(@RequestBody UserEntity addressData) {
        String userEmail = addressData.getUserEmail();
        String userZipCode = addressData.getUserZipCode();
        String userAddr = addressData.getUserAddr();
        String userDetailAddr = addressData.getUserDetailAddr();

        try {
            userService.updateUserAddress(userEmail, userZipCode, userAddr, userDetailAddr);
            return ResponseEntity.ok("User information updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user information: " + e.getMessage());
        }
    }

    // 유저 멤버쉽 정보 컨트롤러
    @PostMapping("/myPage/rank")
    public ResponseEntity<UserRankEntity> getUserRank(@RequestBody UserEntity user) {

        System.out.println("멤버쉽 컨트롤러: " + user.getUserEmail());

        // 멤버쉽 정보 받아옴
        UserRankEntity userRank = userService.findByUserRank(user.getUserEmail());

        return ResponseEntity.ok(userRank);
    }

    // 유저 권한 정보 반환 컨트롤러
    @GetMapping("/role")
    public ResponseEntity<String> findUserRole(HttpServletRequest request) {
        // 쿠키에서 JWT 토큰 가져오기
        String jwtToken = getUserJwtToken(request);

        // JWT 토큰에서 권한 추출
        String userRole = jwtTokenProvider.getUserRoles(jwtToken);
        if (userRole == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nickname not found");
        }

        // System.out.println("userRole: " + userRole);

        return ResponseEntity.ok(userRole);
    }

    // 유저 jwt반환
    @GetMapping("/jwt")
    public ResponseEntity<String> findUserJwt(HttpServletRequest request) {
        // 쿠키에서 JWT 토큰 가져오기
        String jwtToken = getUserJwtToken(request);
        return ResponseEntity.ok(jwtToken);
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

    // 감정사 신청 테이블반환 컨트롤러
    @GetMapping("/myPage/expertRequest1")
    public ResponseEntity<ExpertRequestEntity> findExpertRequest1(HttpServletRequest request) {
        System.out.println("감정사 신청 테이블 반환 컨트롤러");

        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        // 감정사 신청 테이블 받아옴
        ExpertRequestEntity expertRequestEntity = userService.getExpertRequest1(userEmail);

        return ResponseEntity.ok(expertRequestEntity);
    }

    // 감정사 승인 테이블반환 컨트롤러
    @GetMapping("/myPage/expertRequest2")
    public ResponseEntity<ExpertRequestEntityOk> findExpertRequest2(HttpServletRequest request) {
        System.out.println("감정사 신청 승인 테이블 반환 컨트롤러");

        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        // 감정사 신청 테이블 받아옴
        ExpertRequestEntityOk expertRequestEntityOk = userService.getExpertRequest2(userEmail);

        return ResponseEntity.ok(expertRequestEntityOk);
    }

    // 감정사 거절 테이블반환 컨트롤러
    @GetMapping("/myPage/expertRequest3")
    public ResponseEntity<ExpertRequestEntityNo> findExpertRequest3(HttpServletRequest request) {
        System.out.println("감정사 신청 거절 테이블 반환 컨트롤러");

        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        // 감정사 신청 테이블 받아옴
        ExpertRequestEntityNo expertRequestEntityNo = userService.getExpertRequest3(userEmail);

        return ResponseEntity.ok(expertRequestEntityNo);
    }

    @PostMapping("/myPage/expertRequestCancel1")
    public ResponseEntity<String> expertRequestCancel1(@RequestBody UserEntity user) {
        System.out.println("감정사 신청 테이블 삭제 컨트롤러");

        // 감정사 신청 테이블 삭제 서비스 호출
        ResponseEntity<String> responseEntity = userService.expertRequestCancel(user.getUserEmail());

        return responseEntity;
    }

    @PostMapping("/myPage/expertRequestCancel2")
    public ResponseEntity<String> expertRequestCancel2(@RequestBody UserEntity user) {
        System.out.println("감정사 철회 컨트롤러");

        // 감정사 신청 테이블 삭제 서비스 호출
        ResponseEntity<String> responseEntity = userService.expertRequestCancel2(user.getUserEmail());
        return responseEntity;
    }

    @PostMapping("/myPage/expertRequestCancel3")
    public ResponseEntity<String> expertRequestCancel3(@RequestBody UserEntity user) {
        System.out.println("감정사 철회 컨트롤러");

        // 감정사 신청 테이블 삭제 서비스 호출
        ResponseEntity<String> responseEntity = userService.expertRequestCancel3(user.getUserEmail());
        return responseEntity;
    }

    // 구매내역 낙찰정보테이블 불러오기
    @GetMapping("/myPage/bidInfo")
    public ResponseEntity<UserMyAuction> getBid(HttpServletRequest request) {
        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);
        UserMyAuction bidData = userService.findBidData(userEmail);

        return ResponseEntity.ok(bidData);
    }

}
