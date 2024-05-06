package com.artiq.back.matching.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.matching.entity.ExpertRequestEntityOk;
import com.artiq.back.matching.entity.RequestEntity;
import com.artiq.back.matching.service.CommissionListService;

@RestController
public class CommissionListController {

    @Autowired
    private CommissionListService commissionListService;

    @PostMapping("/commission/request")
    public ResponseEntity<String> requestCommission(@RequestBody RequestEntity entity) {
        try {
            commissionListService.updateExpertEmail(entity.getUserEmail(), entity.getReqUserEmail());

            return ResponseEntity.ok("견적 요청이 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 에러: 견적 요청을 처리하는 중 문제가 발생했습니다.");
        }
    }

    @GetMapping("/commissionList/FG")
    public ResponseEntity<List<ExpertRequestEntityOk>> getCommissionsByReGenreAndReField(@RequestParam String reField,
            @RequestParam String reGenre) {
        try {
            List<ExpertRequestEntityOk> commissions = commissionListService.getCommissionsByReGenreAndReField(reField,
                    reGenre);
            System.out.println("조회된 전문가" + commissions.size() + "명");
            return ResponseEntity.ok(commissions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/commissionList/checkEmail")
    public ResponseEntity<String> checkExpertRequest(@RequestParam String userEmail) {
        System.out.println(userEmail + "111111userEmail1111111111111111111111111111111111111111");
        Optional<RequestEntity> result = commissionListService.checkEmail(userEmail);
        if (result.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body("EXIST");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body("NOT_EXIST");
        }
    }
}
