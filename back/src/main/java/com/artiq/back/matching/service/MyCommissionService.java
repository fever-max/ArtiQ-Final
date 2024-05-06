package com.artiq.back.matching.service;

import java.io.File;
import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.artiq.back.matching.entity.RequestEntity;
import com.artiq.back.matching.entity.RequestNOEntity;
import com.artiq.back.matching.entity.RequestOKEntity;
import com.artiq.back.matching.repository.RequestRepository;
import com.artiq.back.matching.repository.RequestRepositoryNO;
import com.artiq.back.matching.repository.RequestRepositoryOK;
import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserRole;
import com.artiq.back.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MyCommissionService {

    private final UserRepository userRepository;
    private final RequestRepository requestRepository;
    private final RequestRepositoryOK requestRepositoryOK;
    private final RequestRepositoryNO requestRepositoryNO;

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

    // 받은 의뢰 신청 테이블 반환
    public RequestEntity getMyCommissionExpert1(String userEmail) {
        System.out.println("받은 의뢰 신청 테이블 서비스");
        Optional<RequestEntity> userOptional = requestRepository.findByUserEmail(userEmail);
        if (userOptional.isPresent()) {
            RequestEntity requestEntity = userOptional.get();
            return requestEntity;
        } else {
            return null;
        }
    }

    // 받은 의뢰 신청 승인 테이블 반환
    public RequestOKEntity getMyCommissionExpert2(String userEmail) {
        System.out.println("받은 의뢰 신청 승인 테이블 서비스");

        Optional<RequestOKEntity> userOptional = requestRepositoryOK.findByUserEmail(userEmail);
        if (userOptional.isPresent()) {
            RequestOKEntity requestOKEntity = userOptional.get();
            return requestOKEntity;
        } else {
            return null;
        }
    }

    // 받은 의뢰 거절 승인 테이블 반환
    public RequestNOEntity getMyCommissionExpert3(String userEmail) {
        System.out.println("받은 의뢰 신청 거절 테이블 서비스");

        Optional<RequestNOEntity> userOptional = requestRepositoryNO.findByUserEmail(userEmail);
        if (userOptional.isPresent()) {
            RequestNOEntity requestNOEntity = userOptional.get();
            return requestNOEntity;
        } else {
            return null;
        }
    }

    ////@@@@@@@@@@@@@@@@@@@@@@@@@@@

    public ResponseEntity<Void> saveCommissionRequestOk(RequestOKEntity requestOK) {
        System.out.println("받은 의뢰 승인 서비스");

        // 기존 정보 받아옴
        Optional<RequestEntity> userOptional = requestRepository
                .findByUserEmail(requestOK.getUserEmail());

        if (userOptional.isPresent()) {
            RequestEntity requestEntity = userOptional.get();

            RequestOKEntity requestOKEntity = RequestOKEntity.builder()
                    .userName(requestEntity.getUserName())
                    .userEmail(requestEntity.getUserEmail())
                    .imageURL(requestEntity.getImageURL())
                    .originalFileName(requestEntity.getOriginalFileName())
                    .saveFileName(requestEntity.getSaveFileName())
                    .reqUserEmail(requestEntity.getReqUserEmail())
                    .reField(requestEntity.getReField())
                    .reGenre(requestEntity.getReGenre())
                    .reArtwork(requestEntity.getReArtwork())
                    .reArtist(requestEntity.getReArtist())
                    .reSize(requestEntity.getReSize())
                    .reProductYear(requestEntity.getReProductYear())
                    .reDetails(requestEntity.getReDetails())
                    .apOkMessage(requestEntity.getApOkMessage())
                    .apOkMessage(requestOK.getApOkMessage())
                    .apDate(LocalDate.now())
                    .build();
            requestRepositoryOK.save(requestOKEntity);

            System.out.println("받은 의뢰 승인 > 테이블 저장");

            requestRepository.delete(requestEntity);

            System.out.println("받은 의뢰 신청 정보 삭제");
        }
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Void> saveCommissionRequestNo(RequestNOEntity requestNO) {
        System.out.println("받은 의뢰 거절 서비스");

        // 기존 정보 받아옴
        Optional<RequestEntity> userOptional = requestRepository
                .findByUserEmail(requestNO.getUserEmail());

        if (userOptional.isPresent()) {
            RequestEntity requestEntity = userOptional.get();

            // 거절 테이블로 값 전달
            RequestNOEntity requestNOEntity = RequestNOEntity.builder()
                    .userName(requestEntity.getUserName())
                    .userEmail(requestEntity.getUserEmail())
                    .imageURL(requestEntity.getImageURL())
                    .originalFileName(requestEntity.getOriginalFileName())
                    .saveFileName(requestEntity.getSaveFileName())
                    .reqUserEmail(requestEntity.getReqUserEmail())
                    .reField(requestEntity.getReField())
                    .reGenre(requestEntity.getReGenre())
                    .reArtwork(requestEntity.getReArtwork())
                    .reArtist(requestEntity.getReArtist())
                    .reSize(requestEntity.getReSize())
                    .reProductYear(requestEntity.getReProductYear())
                    .reDetails(requestEntity.getReDetails())
                    .apOkMessage(requestEntity.getApOkMessage())
                    .apNoMessage(requestNO.getApNoMessage())
                    .apDate(LocalDate.now())
                    .build();
                    requestRepositoryNO.save(requestNOEntity);

            System.out.println("받은 의뢰 거절 > 거절 테이블 저장");

            // 이후 신청 행은 삭제
            requestRepository.delete(requestEntity);

            System.out.println("받은 의뢰 테이블 입력 정보 삭제");
        }
        return ResponseEntity.ok().build();
    }

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // 보낸 의뢰 신청 테이블 반환
    public RequestEntity getMyCommission1(String reqUserEmail) {
        System.out.println("보낸 의뢰 신청 테이블 서비스");
        Optional<RequestEntity> userOptional = requestRepository.findByReqUserEmail(reqUserEmail);
        if (userOptional.isPresent()) {
            RequestEntity requestEntity = userOptional.get();
            return requestEntity;
        } else {
            return null;
        }
    }

    // 보낸 의뢰 신청 승인 테이블 반환
    public RequestOKEntity getMyCommission2(String reqUserEmail) {
        System.out.println("보낸 의뢰 신청 승인 테이블 서비스");

        Optional<RequestOKEntity> userOptional = requestRepositoryOK.findByReqUserEmail(reqUserEmail);
        if (userOptional.isPresent()) {
            RequestOKEntity requestOKEntity = userOptional.get();
            return requestOKEntity;
        } else {
            return null;
        }
    }

    // 보낸 의뢰 거절 승인 테이블 반환
    public RequestNOEntity getMyCommission3(String reqUserEmail) {
        System.out.println("보낸 의뢰 신청 거절 테이블 서비스");

        Optional<RequestNOEntity> userOptional = requestRepositoryNO.findByReqUserEmail(reqUserEmail);
        if (userOptional.isPresent()) {
            RequestNOEntity requestNOEntity = userOptional.get();
            return requestNOEntity;
        } else {
            return null;
        }
    }

     // 보낸 의뢰 테이블 삭제
    public ResponseEntity<String> myCommissionCancel1(String reqUserEmail) {
        System.out.println("보낸 의뢰 테이블 삭제 서비스");

        // 사용자 정보 조회
        Optional<RequestEntity> userOptional = requestRepository.findByReqUserEmail(reqUserEmail);

        RequestEntity userEntity = userOptional.get();
        try {
            File imageFile = new File(userEntity.getSaveFileName());
            ResponseEntity<String> deleteFileResponse = deleteFile(imageFile, "보낸 의뢰 신청 이미지 파일 삭제 실패");
            if (deleteFileResponse != null) {
                return deleteFileResponse;
            }

            requestRepository.delete(userEntity);
            return ResponseEntity.ok("보낸 의뢰 신청 칼럼 삭제 성공");
        } catch (Exception e) {
            System.err.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("보낸 의뢰 신청 정보 삭제 중 오류 발생");
        }
    }

    // 보낸 의뢰 철회 서비스
    public ResponseEntity<String> myCommissionCancel2(String reqUserEmail) {
        System.out.println("보낸 의뢰 철회 서비스");

        // 사용자 정보 조회
        Optional<RequestOKEntity> userOptional = requestRepositoryOK.findByReqUserEmail(reqUserEmail);

        RequestOKEntity userEntity = userOptional.get();
        try {
            File imageFile = new File(userEntity.getSaveFileName());
            ResponseEntity<String> deleteFileResponse = deleteFile(imageFile, "보낸 의뢰 신청 완료 이미지 파일 삭제 실패");
            if (deleteFileResponse != null) {
                return deleteFileResponse;
            }

            requestRepositoryOK.delete(userEntity);

            Optional<UserEntity> userOptional2 = userRepository.findByUserEmail(reqUserEmail);
            UserEntity user = userOptional2.get();
            user.setUserRole(UserRole.ROLE_USER);
            userRepository.save(user);

            return ResponseEntity.ok("보낸 의뢰 신청 완료 칼럼 삭제 성공");
        } catch (Exception e) {
            System.err.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("보낸 의뢰 신청 완료 정보 삭제 중 오류 발생");
        }
    }

    // 보낸 의뢰 신청 내역 삭제
    public ResponseEntity<String> myCommissionCancel3(String reqUserEmail) {
        System.out.println("보낸 의뢰 거절 테이블 삭제 서비스");

        // 사용자 정보 조회
        Optional<RequestNOEntity> userOptional = requestRepositoryNO.findByReqUserEmail(reqUserEmail);
        RequestNOEntity userEntity = userOptional.get();

        try {
            File imageFile = new File(userEntity.getSaveFileName());
            ResponseEntity<String> deleteFileResponse = deleteFile(imageFile, "보낸 의뢰 거절 이미지 파일 삭제 실패");
            if (deleteFileResponse != null) {
                return deleteFileResponse;
            }

            requestRepositoryNO.delete(userEntity);
            return ResponseEntity.ok("보낸 의뢰 거절 칼럼 삭제 성공");
        } catch (Exception e) {
            System.err.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("보낸 의뢰 거절 정보 삭제 중 오류 발생");
        }
    }
}
