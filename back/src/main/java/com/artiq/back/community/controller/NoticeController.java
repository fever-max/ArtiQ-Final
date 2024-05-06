package com.artiq.back.community.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.community.entity.NoticeEntity;
import com.artiq.back.community.service.NoticeService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.artiq.back.config.security.JwtTokenProvider;

@RestController
public class NoticeController {

    private final NoticeService noticeService;
    private final JwtTokenProvider jwtTokenProvider;
    private Long lastNoticeNumber = 0L;
    
    @Autowired
    public NoticeController(NoticeService noticeService, JwtTokenProvider jwtTokenProvider) {
        this.noticeService = noticeService;
        this.jwtTokenProvider = jwtTokenProvider;
        updateLastNoticeNumber();
    }

    // 사용자의 JWT 토큰을 가져오는 메서드
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

    // 마지막 게시물 번호 업데이트 메서드
    private void updateLastNoticeNumber() {
        lastNoticeNumber = noticeService.getMaxNoticeNumber() != null ? noticeService.getMaxNoticeNumber() : 0L;
    }
    

    // 유저 닉네임과 이메일을 반환하는 엔드포인트
    @GetMapping("/noticeBoard/getEmail")
    public ResponseEntity<Map<String, String>> getEmail(HttpServletRequest request) {
        String jwtToken = getUserJwtToken(request);

        String nickname = jwtTokenProvider.getUserNickname(jwtToken);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        Map<String, String> response = new HashMap<>();
        response.put("userNickname", nickname);
        response.put("userEmail", userEmail);
        

        return ResponseEntity.ok(response);
        
    }


    // 모든 게시글 조회
    @GetMapping("/noticeBoard")
    public ResponseEntity<List<NoticeEntity>> getAllNoticeBoardData() {
        List<NoticeEntity> noticeBoardData = noticeService.findAllNoticeData();
        return ResponseEntity.ok(noticeBoardData);
    }

    // 게시글 등록
    @PostMapping("/noticeBoard/write")
    public ResponseEntity<String> saveNoticeBoard(@RequestBody NoticeEntity noticeEntity, HttpServletRequest request) {
        
        try {
            String jwtToken = getUserJwtToken(request);

            String nickname = jwtTokenProvider.getUserNickname(jwtToken);
            String userEmail = jwtTokenProvider.getUserEmail(jwtToken);
    
            noticeEntity.setUserNickname(nickname);
            noticeEntity.setUserEmail(userEmail);
    
            noticeEntity.setNoticeNumber(++lastNoticeNumber);
    
            noticeService.saveNoticeBoard(noticeEntity);
    
            updateLastNoticeNumber();
    
            return ResponseEntity.ok("게시글이 성공적으로 등록되었습니다.");
    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 등록에 실패했습니다. 다시 시도해주세요.");
        }
    }
    



    // 게시물 상세 정보 조회 엔드포인트
    @GetMapping("/noticeBoardDetail/{id}")
    public ResponseEntity<NoticeEntity> getBoardDetail(@PathVariable("id") Long id) {
        NoticeEntity boardDetail = noticeService.getNoticeEntity(id);
        return ResponseEntity.ok(boardDetail);
    }

    // 조회수 저장 엔드포인트
    @GetMapping("/noticeDetail/increaseViewCount/{noticeNumber}")
    public ResponseEntity<String> saveViewCount(@PathVariable("noticeNumber") Long id) {
    System.out.println("조회수 증가 컨트롤러 실행");
    try {
        // 조회수 증가 처리
        noticeService.increaseViewCount(id);
        return ResponseEntity.ok("조회수 증가 성공");
    } catch (DataNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("조회수 증가 실패.");
    }
}

//삭제
    @DeleteMapping("/noticeDetail/{noticeNumber}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long noticeNumber) {
        try {
            noticeService.deleteBoard(noticeNumber); 
            return ResponseEntity.ok("게시글이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 삭제에 실패했습니다.");
        }
    }
    

    
    
}
    

