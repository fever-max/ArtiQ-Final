package com.artiq.back.user.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserPointEntity;
import com.artiq.back.user.entity.UserRankEntity;
import com.artiq.back.user.repository.UserPointRepository;
import com.artiq.back.user.repository.UserRankRepository;
import com.artiq.back.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PointService {

    private final UserPointRepository userPointRepository;
    private final UserRepository userRepository;
    private final UserRankRepository userRankRepository;

    // 결제 정보 저장
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
                int addPoint = beforePoint + afterPoint;
                rankEntity.setRankPoint(String.valueOf(addPoint));
                userRankRepository.save(rankEntity);
                System.out.println("멤버쉽 테이블 추가");
            }

            return ResponseEntity.ok().build();

        } else {
            // // 유저가 존재하지않으면 404에러
            return ResponseEntity.notFound().build();
        }
    }

    // 유저 포인트 테이블 반환 서비스
    public ResponseEntity<List<UserPointEntity>> findByUserPointTable(String userEmail) {
        System.out.println("유저 테이블 반환 서비스");

        // 유저 테이블에서 db 검사
        Optional<UserEntity> userOptional = userRepository.findByUserEmail(userEmail);

        // 사용자가 존재하는지 확인
        if (userOptional.isPresent()) {
            // 해당 userEmail에 해당하는 사용자 포인트 엔티티 리스트를 찾음
            // 리스트로 반환
            List<UserPointEntity> userPointEntities = userPointRepository.findAllByUserEmail(userEmail);

            // 사용자 포인트 정보가 존재하면 해당 리스트 반환
            if (!userPointEntities.isEmpty()) {
                return ResponseEntity.ok(userPointEntities);
            } else {
                // 사용자 포인트 정보가 존재하지 않으면 빈 리스트 반환
                return ResponseEntity.ok(Collections.emptyList());
            }
        } else {
            // 유저가 존재하지 않으면 404 에러
            return ResponseEntity.notFound().build();
        }
    }

}
