package com.artiq.back.user.service;

import java.io.File;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.artiq.back.auction.entity.ArtDataEntity;
import com.artiq.back.auction.entity.ArtDataEntity2;
import com.artiq.back.auction.entity.AuctionFavoriteEntity;
import com.artiq.back.auction.entity.BidEntity;
import com.artiq.back.auction.repository.ArtDataRepository;
import com.artiq.back.auction.repository.BidRepository;
import com.artiq.back.auction.repository.BidRepository2;
import com.artiq.back.matching.entity.ExpertRequestEntity;
import com.artiq.back.matching.entity.ExpertRequestEntityNo;
import com.artiq.back.matching.entity.ExpertRequestEntityOk;
import com.artiq.back.matching.repository.AppraiseFinRepository;
import com.artiq.back.matching.repository.AppraiseFinRepositoryNo;
import com.artiq.back.matching.repository.AppraiseFinRepositoryOk;
import com.artiq.back.user.dto.UserMyAuction;
import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserRole;
import com.artiq.back.user.entity.UserRankEntity;
import com.artiq.back.user.repository.UserRankRepository;
import com.artiq.back.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserRankRepository userRankRepository;

    private final AppraiseFinRepository appraiseFinRepository;
    private final AppraiseFinRepositoryOk appraiseFinRepositoryOk;
    private final AppraiseFinRepositoryNo appraiseFinRepositoryNo;

    private final PasswordEncoder passwordEncoder;

    private final BidRepository2 bidRepository;
    private final ArtDataRepository artDataRepository;

    // 회원정보 반환 서비스
    public UserEntity findByUserInfos(String userEmail) {
        Optional<UserEntity> userOptional = userRepository.findByUserEmail(userEmail);
        UserEntity userEntity = userOptional.get();
        userEntity.setUserPw("테스트번호임글자수용도");

        return userEntity;
    }

    // 회원정보 업데이트 (데이터베이스 일관성을 위해 Transactional 사용 )
    @Transactional
    public ResponseEntity<Void> updateUser(String userEmail, Map<String, String> fields) {
        // 사용자를 이메일로 찾기
        Optional<UserEntity> userOptional = userRepository.findByUserEmail(userEmail);

        if (userOptional.isPresent()) {
            UserEntity userEntity = userOptional.get();

            // 필드 값을 업데이트하기
            for (Map.Entry<String, String> entry : fields.entrySet()) {
                String fieldName = entry.getKey();
                String fieldValue = entry.getValue();

                switch (fieldName) {
                    case "userPw":
                        userEntity.setUserPw(passwordEncoder.encode(fieldValue)); // 비밀번호 암호화
                        break;
                    case "userName":
                        userEntity.setUserName(fieldValue);
                        break;
                    case "userTel":
                        userEntity.setUserTel(fieldValue);
                        break;
                    case "userBirth":
                        // 생일을 문자열에서 LocalDate로 변환하여 설정
                        LocalDate birthDate = LocalDate.parse(fieldValue);
                        userEntity.setUserBirth(birthDate);
                        break;
                    case "userNickname":
                        userEntity.setUserNickname(fieldValue);
                        break;
                    case "userProfile":
                        userEntity.setUserProfile(fieldValue);
                        break;
                    default:
                        throw new IllegalArgumentException("Invalid field name: " + fieldName);
                }
            }
            // 업데이트된 사용자 정보를 저장하기
            userRepository.save(userEntity);

            return ResponseEntity.ok().build();

        } else {
            // 유저가 존재하지않으면 404에러
            return ResponseEntity.notFound().build();
        }

    }

    // 유저 배송주소 업데이트
    public ResponseEntity<String> updateUserAddress(String userEmail, String userZipCode, String userAddr,
            String userDetailAddr) {

        Optional<UserEntity> userOptional = userRepository.findByUserEmail(userEmail);
        if (userOptional.isPresent()) {
            UserEntity userEntity = userOptional.get();
            userEntity.setUserZipCode(userZipCode);
            userEntity.setUserAddr(userAddr);
            userEntity.setUserDetailAddr(userDetailAddr);
            userRepository.save(userEntity);
            return ResponseEntity.ok().body("주소 정보가 업데이트 되었습니다.");
        } else {
            String errorMessage = "해당 이메일을 가진 사용자를 찾을 수 없습니다: " + userEmail;
            System.err.println(errorMessage); // 에러 메시지를 로그에 출력
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
    }

    // 유저 멤버쉽 정보 반환
    public UserRankEntity findByUserRank(String userEmail) {
        Optional<UserRankEntity> userOptional = userRankRepository.findByUserEmail(userEmail);
        UserRankEntity userRank = userOptional.get();

        return userRank;
    }

    // 감정사 신청 테이블 반환
    public ExpertRequestEntity getExpertRequest1(String userEmail) {
        System.out.println("감정사 신청 테이블 서비스");
        Optional<ExpertRequestEntity> userOptional = appraiseFinRepository.findByUserEmail(userEmail);
        if (userOptional.isPresent()) {
            ExpertRequestEntity expertRequestEntity = userOptional.get();
            return expertRequestEntity;
        } else {
            return null;
        }
    }

    // 감정사 신청 승인 테이블 반환
    public ExpertRequestEntityOk getExpertRequest2(String userEmail) {
        System.out.println("감정사 신청 승인 테이블 서비스");

        Optional<ExpertRequestEntityOk> userOptional = appraiseFinRepositoryOk.findByUserEmail(userEmail);
        if (userOptional.isPresent()) {
            ExpertRequestEntityOk expertRequestEntityOk = userOptional.get();
            return expertRequestEntityOk;
        } else {
            return null;
        }
    }

    // 감정사 거절 승인 테이블 반환
    public ExpertRequestEntityNo getExpertRequest3(String userEmail) {
        System.out.println("감정사 신청 거절 테이블 서비스");

        Optional<ExpertRequestEntityNo> userOptional = appraiseFinRepositoryNo.findByUserEmail(userEmail);
        if (userOptional.isPresent()) {
            ExpertRequestEntityNo expertRequestEntityNo = userOptional.get();
            return expertRequestEntityNo;
        } else {
            return null;
        }
    }

    // 감정사 테이블 삭제
    public ResponseEntity<String> expertRequestCancel(String userEmail) {
        System.out.println("감정사 테이블 삭제 서비스");

        // 사용자 정보 조회
        Optional<ExpertRequestEntity> userOptional = appraiseFinRepository.findByUserEmail(userEmail);

        ExpertRequestEntity userEntity = userOptional.get();
        try {
            File imageFile = new File(userEntity.getSaveFileName());
            ResponseEntity<String> deleteFileResponse = deleteFile(imageFile, "감정사 신청 이미지 파일 삭제 실패");
            if (deleteFileResponse != null) {
                return deleteFileResponse;
            }

            appraiseFinRepository.delete(userEntity);
            return ResponseEntity.ok("감정사 신청 칼럼 삭제 성공");
        } catch (Exception e) {
            System.err.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("감정사 신청 정보 삭제 중 오류 발생");
        }
    }

    // 감정사 철회 서비스
    public ResponseEntity<String> expertRequestCancel2(String userEmail) {
        System.out.println("감정사 철회 서비스");

        // 사용자 정보 조회
        Optional<ExpertRequestEntityOk> userOptional = appraiseFinRepositoryOk.findByUserEmail(userEmail);

        ExpertRequestEntityOk userEntity = userOptional.get();
        try {
            File imageFile = new File(userEntity.getSaveFileName());
            ResponseEntity<String> deleteFileResponse = deleteFile(imageFile, "감정사 신청 완료 이미지 파일 삭제 실패");
            if (deleteFileResponse != null) {
                return deleteFileResponse;
            }

            appraiseFinRepositoryOk.delete(userEntity);

            Optional<UserEntity> userOptional2 = userRepository.findByUserEmail(userEmail);
            UserEntity user = userOptional2.get();
            user.setUserRole(UserRole.ROLE_USER);
            userRepository.save(user);

            return ResponseEntity.ok("감정사 신청 완료 칼럼 삭제 성공");
        } catch (Exception e) {
            System.err.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("감정사 신청 완료 정보 삭제 중 오류 발생");
        }
    }

    // 감정사 신청 내역 삭제
    public ResponseEntity<String> expertRequestCancel3(String userEmail) {
        System.out.println("감정사 거절 테이블 삭제 서비스");

        // 사용자 정보 조회
        Optional<ExpertRequestEntityNo> userOptional = appraiseFinRepositoryNo.findByUserEmail(userEmail);
        ExpertRequestEntityNo userEntity = userOptional.get();

        try {
            File imageFile = new File(userEntity.getSaveFileName());
            ResponseEntity<String> deleteFileResponse = deleteFile(imageFile, "감정사 거절 이미지 파일 삭제 실패");
            if (deleteFileResponse != null) {
                return deleteFileResponse;
            }

            appraiseFinRepositoryNo.delete(userEntity);
            return ResponseEntity.ok("감정사 거절 칼럼 삭제 성공");
        } catch (Exception e) {
            System.err.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("감정사 거절 정보 삭제 중 오류 발생");
        }
    }

    // 파일 삭제 메서드
    private ResponseEntity<String> deleteFile(File file, String errorMessage) {
        if (file.exists()) {
            if (!file.delete()) {
                // 파일 삭제 실패 시 에러 메시지 반환
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(errorMessage);
            }
        }
        return null;
    }


     public UserMyAuction findBidData(String bidUserEmail) {
        
        List<BidEntity> bidData = bidRepository.findByBidUserEmail(bidUserEmail);
        List<Integer> productNos = bidData.stream().map(BidEntity::getAcProductNo).collect(Collectors.toList());
        
        List<ArtDataEntity> artData = artDataRepository.findByArtIdIn(productNos);

        // 데이터를 Map으로 묶어서 반환
        UserMyAuction aDTO = new UserMyAuction();
         aDTO.setBidData(bidData);
         aDTO.setArtData(artData);

        return aDTO;

        }


}
