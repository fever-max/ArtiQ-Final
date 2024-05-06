package com.artiq.back.user.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.artiq.back.matching.entity.ExpertRequestEntity;
import com.artiq.back.matching.entity.ExpertRequestEntityNo;
import com.artiq.back.matching.entity.ExpertRequestEntityOk;
import com.artiq.back.matching.repository.AppraiseFinRepository;
import com.artiq.back.matching.repository.AppraiseFinRepositoryNo;
import com.artiq.back.matching.repository.AppraiseFinRepositoryOk;
import com.artiq.back.user.dto.UserDetailDto;
import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserPointEntity;
import com.artiq.back.user.entity.UserRankEntity;
import com.artiq.back.user.entity.UserRole;
import com.artiq.back.user.entity.UserSocialEntity;
import com.artiq.back.user.repository.UserPointRepository;
import com.artiq.back.user.repository.UserRankRepository;
import com.artiq.back.user.repository.UserRepository;
import com.artiq.back.user.repository.UserSocialRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserRankRepository userRankRepository;
    private final UserSocialRepository userSocialRepository;
    private final UserPointRepository userPointRepository;

    private final AppraiseFinRepository appraiseFinRepository;
    private final AppraiseFinRepositoryOk appraiseFinRepositoryOk;
    private final AppraiseFinRepositoryNo appraiseFinRepositoryNo;

    // 회원정보 반환
    public List<UserDetailDto> getUserInfo() {
        System.out.println("어드민 유저정보 서비스 실행");

        // 만들어둔 dto에 담아서 반환
        List<UserDetailDto> userInfo = userRepository.findUserDetails();
        return userInfo;
    }

    // 유저정보 업데이트
    public ResponseEntity<Void> updateUserInfo(UserDetailDto editedUserInfo) {
        Optional<UserEntity> userOptional = userRepository.findByUserEmail(editedUserInfo.getUserEmail());

        if (userOptional.isPresent()) {
            UserEntity userEntity = userOptional.get();
            updateUserData(userEntity, editedUserInfo); // 유저 테이블 업데이트
            updateMembershipData(editedUserInfo); // 멤버쉽 테이블 업데이트
            userRepository.save(userEntity);
            return ResponseEntity.ok().build();
        } else {
            String errorMessage = "해당 이메일을 가진 사용자를 찾을 수 없습니다: " + editedUserInfo.getUserEmail();
            throw new IllegalArgumentException(errorMessage);
        }
    }

    private void updateUserData(UserEntity userEntity, UserDetailDto editedUserInfo) {
        userEntity.setUserNickname(editedUserInfo.getUserNickname());
        userEntity.setUserRole(UserRole.valueOf(editedUserInfo.getUserRole()));
    }

    private void updateMembershipData(UserDetailDto editedUserInfo) {
        Optional<UserRankEntity> userOptional = userRankRepository.findByUserEmail(editedUserInfo.getUserEmail());

        if (userOptional.isPresent()) {
            UserRankEntity userRankEntity = userOptional.get();
            userRankEntity.setRankPoint(editedUserInfo.getRankPoint());
            userRankRepository.save(userRankEntity);
        }
    }

    // 유저 삭제 서비스
    @Transactional
    public ResponseEntity<Void> deleteUser(String userEmail) {

        // 유저 테이블 삭제
        Optional<UserEntity> userOptional = userRepository.findByUserEmail(userEmail);
        if (userOptional.isPresent()) {
            System.out.println("유저정보 삭제");
            userRepository.delete(userOptional.get());
        }

        // 유저 포인트 삭제
        Optional<UserRankEntity> userOptional2 = userRankRepository.findByUserEmail(userEmail);
        if (userOptional2.isPresent()) {
            System.out.println("포인트 삭제");
            userRankRepository.delete(userOptional2.get());
        }

        // 결제 내역 삭제
        List<UserPointEntity> userPointList = userPointRepository.findAllByUserEmail(userEmail);
        if (!userPointList.isEmpty()) {
            System.out.println("결제내역 삭제");
            userPointRepository.deleteAll(userPointList);
        }

        // 만일 유저 소셜이 있다면 소셜테이블에서도 삭제 (여긴 없을 수도 있음)
        Optional<UserSocialEntity> userOptional3 = userSocialRepository.findByUserEmail(userEmail);
        if (userOptional3.isPresent()) {
            System.out.println("소셜정보 삭제");
            userSocialRepository.delete(userOptional3.get());
        }

        return ResponseEntity.ok().build();
    }

    // 전문가 신청 리스트 반환
    public List<ExpertRequestEntity> getExpertReqList() {
        System.out.println("전문가 신청 리스트 반환");
        return appraiseFinRepository.findAll();
    }

    public ResponseEntity<Void> saveExpertRequestOk(ExpertRequestEntity expertRequestEntity) {

        System.out.println("감정사 승인 서비스");

        ExpertRequestEntityOk expertRequestEntityOk = ExpertRequestEntityOk.builder()
                .userName(expertRequestEntity.getUserName())
                .userEmail(expertRequestEntity.getUserEmail())
                .imageURL(expertRequestEntity.getImageURL())
                .originalFileName(expertRequestEntity.getOriginalFileName())
                .saveFileName(expertRequestEntity.getSaveFileName())
                .fileSize(expertRequestEntity.getFileSize())
                .reField(expertRequestEntity.getReField())
                .reGenre1(expertRequestEntity.getReGenre1())
                .reGenre2(expertRequestEntity.getReGenre2())
                .reGenre3(expertRequestEntity.getReGenre3())
                .reGenre4(expertRequestEntity.getReGenre4())
                .reGenre5(expertRequestEntity.getReGenre5())
                .apCareer(expertRequestEntity.getApCareer())
                .apMessage(expertRequestEntity.getApMessage())
                .apDate(LocalDate.now())
                .build();
        appraiseFinRepositoryOk.save(expertRequestEntityOk);

        System.out.println("감정사 승인 > 테이블 저장");

        // 기존 신청 테이블 정보 삭제
        Optional<ExpertRequestEntity> userOptional = appraiseFinRepository
                .findByUserEmail(expertRequestEntity.getUserEmail());
        if (userOptional.isPresent()) {
            System.out.println("감정사 신청 정보 삭제");
            appraiseFinRepository.delete(userOptional.get());
        }

        // 유저 등급 변경
        Optional<UserEntity> userOptional2 = userRepository.findByUserEmail(expertRequestEntity.getUserEmail());
        if (userOptional2.isPresent()) {
            System.out.println("유저>전문가 변경");
            UserEntity userEntity = userOptional2.get();
            userEntity.setUserRole(UserRole.ROLE_EXPERT);
            userRepository.save(userEntity);
        }

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Void> saveExpertRequestNo(ExpertRequestEntityNo expertRequestNo) {
        System.out.println("감정사 거절 서비스");

        // 기존 정보 받아옴
        Optional<ExpertRequestEntity> userOptional = appraiseFinRepository
                .findByUserEmail(expertRequestNo.getUserEmail());

        if (userOptional.isPresent()) {
            ExpertRequestEntity expertRequestEntity = userOptional.get();

            // 거절 테이블로 값 전달
            ExpertRequestEntityNo expertRequestEntityNo = ExpertRequestEntityNo.builder()
                    .userName(expertRequestEntity.getUserName())
                    .userEmail(expertRequestEntity.getUserEmail())
                    .imageURL(expertRequestEntity.getImageURL())
                    .originalFileName(expertRequestEntity.getOriginalFileName())
                    .saveFileName(expertRequestEntity.getSaveFileName())
                    .fileSize(expertRequestEntity.getFileSize())
                    .reField(expertRequestEntity.getReField())
                    .reGenre1(expertRequestEntity.getReGenre1())
                    .reGenre2(expertRequestEntity.getReGenre2())
                    .reGenre3(expertRequestEntity.getReGenre3())
                    .reGenre4(expertRequestEntity.getReGenre4())
                    .reGenre5(expertRequestEntity.getReGenre5())
                    .apCareer(expertRequestEntity.getApCareer())
                    .apMessage(expertRequestEntity.getApMessage())
                    .apNoMessage(expertRequestNo.getApNoMessage()) // 이것만 기존에 받아온 것
                    .apDate(LocalDate.now())
                    .build();
            appraiseFinRepositoryNo.save(expertRequestEntityNo);

            System.out.println("감정사 거절 > 거절 테이블 저장");

            // 이후 신청 행은 삭제
            appraiseFinRepository.delete(expertRequestEntity);

            System.out.println("신청 테이블 입력 정보 삭제");
        }
        return ResponseEntity.ok().build();
    }

    // 결제 테이블 반환
    public List<UserPointEntity> getUserPointInfo() {
        return userPointRepository.findAll();
    }

    public void deleteUserPointTable(String pointCertify) {
        // 유저 포인트 엔터티 조회
        Optional<UserPointEntity> userOptional = userPointRepository.findByPointCertify(pointCertify);
        if (!userOptional.isPresent()) {
            return;
        }
        UserPointEntity userPointEntity = userOptional.get();
        int pointCharge = Integer.parseInt(userPointEntity.getPointCharge());

        // 랭크 테이블 포인트 감소
        Optional<UserRankEntity> userRankOptional = userRankRepository.findByUserEmail(userPointEntity.getUserEmail());
        userRankOptional.ifPresent(userRankEntity -> {
            int userPoint = Integer.parseInt(userRankEntity.getRankPoint());
            int minusPoint = userPoint - pointCharge;
            userRankEntity.setRankPoint(String.valueOf(minusPoint));
            userRankRepository.save(userRankEntity);
            System.out.println("랭크 테이블 포인트 감소 완료");
        });

        // 결제 테이블 삭제
        userPointRepository.delete(userPointEntity);
        System.out.println("결제 테이블 삭제 완료");
    }

}
