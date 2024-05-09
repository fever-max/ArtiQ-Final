package com.artiq.back.community.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.beans.factory.annotation.Autowired;

import com.artiq.back.community.entity.CommentEntity;
import com.artiq.back.community.entity.FreeBoardEntity;
import com.artiq.back.community.service.CommentService;
import com.artiq.back.community.service.FreeBoardService;
import com.artiq.back.community.service.VoteService;
import com.artiq.back.config.security.JwtTokenProvider;
import com.artiq.back.user.entity.UserEntity;

@RestController
public class FreeBoardController {

    private final FreeBoardService freeBoardService;
    private final CommentService commentService;
    private final JwtTokenProvider jwtTokenProvider;
    private Long lastBoardNumber = 0L;

    @Autowired
    public FreeBoardController(FreeBoardService freeBoardService, JwtTokenProvider jwtTokenProvider,
            CommentService commentService, VoteService voteService) {
        this.freeBoardService = freeBoardService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.commentService = commentService;
        updateLastBoardNumber();
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
    private void updateLastBoardNumber() {
        lastBoardNumber = freeBoardService.getMaxBoardNumber() != null ? freeBoardService.getMaxBoardNumber() : 0L;
    }

    // 유저 닉네임과 이메일을 반환하는 엔드포인트
    @GetMapping("/freeBoard/getEmail")
    public ResponseEntity<Map<String, String>> getEmail(HttpServletRequest request) {
        String jwtToken = getUserJwtToken(request);

        String nickname = jwtTokenProvider.getUserNickname(jwtToken);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        Map<String, String> response = new HashMap<>();
        response.put("userNickname", nickname);
        response.put("userEmail", userEmail);

        return ResponseEntity.ok(response);
    }

    // 모든 게시글 조회 엔드포인트
    @GetMapping("/freeBoard")
    public ResponseEntity<List<FreeBoardEntity>> getAllFreeBoardData() {
        List<FreeBoardEntity> freeBoardData = freeBoardService.findAllFreeBoardData();
        return ResponseEntity.ok(freeBoardData);
    }

    // 게시글 등록 엔드포인트
    @PostMapping("/freeBoard/write")
    public ResponseEntity<String> saveFreeBoard(@RequestBody FreeBoardEntity freeboardEntity,
            HttpServletRequest request) {
        try {
            String jwtToken = getUserJwtToken(request);

            String nickname = jwtTokenProvider.getUserNickname(jwtToken);
            String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

            freeboardEntity.setUserNickname(nickname);
            freeboardEntity.setUserEmail(userEmail);

            freeboardEntity.setBoardNumber(++lastBoardNumber);

            freeBoardService.saveFreeBoard(freeboardEntity);

            updateLastBoardNumber();

            return ResponseEntity.ok("게시글이 성공적으로 등록되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 등록에 실패했습니다. 다시 시도해주세요.");
        }
    }

    // 게시물 상세 정보 조회 엔드포인트
    @GetMapping("/freeBoardDetail/{id}")
    public ResponseEntity<FreeBoardEntity> getBoardDetail(@PathVariable("id") Long id) {
        FreeBoardEntity boardDetail = freeBoardService.getFreeBoardEntity(id);
        return ResponseEntity.ok(boardDetail);
    }

    // 댓글 저장 엔드포인트
    @PostMapping("/freeBoardDetail/saveComment")
    public void saveComment(@RequestBody CommentEntity entity) {
        commentService.saveComment(entity);
    }

    // 조회수 저장 엔드포인트
    @GetMapping("/freeBoardDetail/increaseViewCount/{boardNumber}")
    public ResponseEntity<String> saveViewCount(@PathVariable("boardNumber") Long id) {
        System.out.println("조회수 증가 컨트롤러 실행");
        try {
            // 조회수 증가 처리
            freeBoardService.increaseViewCount(id);
            return ResponseEntity.ok("조회수 증가 성공");
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("조회수 증가 실패.");
        }
    }

    // 삭제
    @DeleteMapping("/freeBoardDetail/{boardNumber}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long boardNumber) {
        try {
            freeBoardService.deleteBoard(boardNumber);
            return ResponseEntity.ok("게시글이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 삭제에 실패했습니다.");
        }
    }
}
