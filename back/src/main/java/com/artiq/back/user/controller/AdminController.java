package com.artiq.back.user.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.matching.entity.ExpertRequestEntity;
import com.artiq.back.matching.entity.ExpertRequestEntityNo;
import com.artiq.back.user.dto.UserDetailDto;
import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserPointEntity;
import com.artiq.back.user.service.AdminService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    // 유저 전체 정보 컨트롤러
    @GetMapping("/userInfo")
    public ResponseEntity<List<UserDetailDto>> getUserInfos() {
        System.out.println("어드민 유저정보 컨트롤러 실행");
        List<UserDetailDto> userInfo = adminService.getUserInfo();

        // userInfo.forEach(userDetailDto -> {
        // System.out.println("User ID: " + userDetailDto.getUserEmail());
        // System.out.println("User Name: " + userDetailDto.getUserNickname());
        // });
        return ResponseEntity.ok(userInfo);
    }

    // 유저 정보 업데이트 컨트롤러
    @PostMapping("/userInfo/update")
    public ResponseEntity<String> getUserInfoUpdate(@RequestBody UserDetailDto editedUserInfo) {
        System.out.println("어드민 유저정보 업데이트 컨트롤러 실행");
        try {
            // 업데이트 컨트롤러
            adminService.updateUserInfo(editedUserInfo);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user information: " + e.getMessage());
        }
    }

    // 유저 정보 삭제 컨트롤러
    @PostMapping("/userInfo/delete")
    public ResponseEntity<String> getUserInfoDelete(@RequestBody UserEntity userEntity) {
        System.out.println("어드민 유저정보 삭제 컨트롤러 실행");
        System.out.println("삭제 이메일: " + userEntity.getUserEmail());
        try {
            // 업데이트 컨트롤러
            adminService.deleteUser(userEntity.getUserEmail());
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user information: " + e.getMessage());
        }
    }

    // 감정사 신청 내역 컨트롤러
    @GetMapping("/expertData")
    public ResponseEntity<List<ExpertRequestEntity>> getAllTestEntities() {
        System.out.println("어드민 감정사 신청 내역 컨트롤러 실행");
        List<ExpertRequestEntity> expertRequestEntity = adminService.getExpertReqList();
        return ResponseEntity.ok(expertRequestEntity);
    }

    // 감정사 승인 컨트롤러
    @PostMapping("/expertData/ok")
    public ResponseEntity<String> postExpertData(@RequestBody ExpertRequestEntity expertRequestEntity) {
        System.out.println("어드민 감정사 승인 컨트롤러 실행");
        System.out.println("expertRequestEntity.getUserEmail()" + expertRequestEntity.getUserEmail());
        try {
            adminService.saveExpertRequestOk(expertRequestEntity);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("승인 실패 " + e.getMessage());
        }
    }

    // 감정사 거절 컨트롤러
    @PostMapping("/expertData/reject")
    public ResponseEntity<String> rejectExpertData(@RequestBody ExpertRequestEntityNo expertRequestNo) {
        System.out.println("어드민 감정사 거절 컨트롤러 실행");
        // System.out.println("거절이메일: " + expertRequestNo.getUserEmail());
        // System.out.println("거절사유: " + expertRequestNo.getApNoMessage());
        try {
            adminService.saveExpertRequestNo(expertRequestNo);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("거절 실패 " + e.getMessage());
        }
    }

    // 결제 내역 컨트롤러
    @GetMapping("/userPointTable")
    public ResponseEntity<List<UserPointEntity>> getUserPointInfos() {
        System.out.println("어드민 결제 테이블 컨트롤러 실행");
        List<UserPointEntity> userPointTable = adminService.getUserPointInfo();
        // userInfo.forEach(userDetailDto -> {
        // System.out.println("User ID: " + userDetailDto.getUserEmail());
        // System.out.println("User Name: " + userDetailDto.getUserNickname());
        // });
        return ResponseEntity.ok(userPointTable);
    }

    // 결제 취소 컨트롤러
    @PostMapping("/userPointTable/cancel")
    public ResponseEntity<Void> deleteUserPointTable(@RequestBody UserPointEntity userPointEntity) {
        System.out.println("결제 취소 컨트롤러 실행");
        System.out.println("넘어온 결제 번호: " + userPointEntity.getPointCertify());
        adminService.deleteUserPointTable(userPointEntity.getPointCertify());
        return ResponseEntity.ok().build();
    }

}
