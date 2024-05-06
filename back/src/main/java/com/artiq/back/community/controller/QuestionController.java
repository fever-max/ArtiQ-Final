package com.artiq.back.community.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.community.entity.AnswerEntity;
import com.artiq.back.community.entity.CommentEntity;
import com.artiq.back.community.entity.QuestionEntity;
import com.artiq.back.community.service.AnswerService;
import com.artiq.back.community.service.CommentService;
import com.artiq.back.community.service.QuestionService;
import com.artiq.back.community.service.VoteService;
import com.artiq.back.config.security.JwtTokenProvider;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class QuestionController {

    private final QuestionService questionService;
    private final AnswerService answerService;
    private final JwtTokenProvider jwtTokenProvider;
    private final VoteService voteService;
    private Long lastQuestionNumber = 0L;

    @Autowired
    public QuestionController(QuestionService questionService, JwtTokenProvider jwtTokenProvider,
            AnswerService answerService, VoteService voteService) {
        this.questionService = questionService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.answerService = answerService;
        this.voteService = voteService;
        updateLastQuestionNumber();
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
    private void updateLastQuestionNumber() {
        lastQuestionNumber = questionService.getMaxQuestionNumber() != null ? questionService.getMaxQuestionNumber() : 0L;
    }

    // 유저 닉네임과 이메일을 반환하는 엔드포인트
    @GetMapping("/questionBoard/getEmail")
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
    @GetMapping("/questionBoard")
    public ResponseEntity<List<QuestionEntity>> getAllQuestionBoardData() {
        List<QuestionEntity> questionBoardData = questionService.findAllQuestionData();
        return ResponseEntity.ok(questionBoardData);
    }

    // 게시글 등록
    @PostMapping("/question/write")
    public ResponseEntity<String> saveQuestionBoard(@RequestBody QuestionEntity questionEntity, HttpServletRequest request) {
        
        try {
            String jwtToken = getUserJwtToken(request);

            String nickname = jwtTokenProvider.getUserNickname(jwtToken);
            String userEmail = jwtTokenProvider.getUserEmail(jwtToken);
    
            questionEntity.setUserNickname(nickname);
            questionEntity.setUserEmail(userEmail);
    
            questionEntity.setQuestionNumber(++lastQuestionNumber);
    
            questionService.saveQuestionBoard(questionEntity);
    
            updateLastQuestionNumber();
    
            return ResponseEntity.ok("게시글이 성공적으로 등록되었습니다.");
    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 등록에 실패했습니다. 다시 시도해주세요.");
        }
    }

    // 게시물 상세 정보 조회 엔드포인트
    @GetMapping("/questionDetail/{id}")
    public ResponseEntity<QuestionEntity> getBoardDetail(@PathVariable("id") Long id) {
        QuestionEntity boardDetail = questionService.getQuestionEntity(id);
        return ResponseEntity.ok(boardDetail);
    }

     // 조회수 저장 엔드포인트
     @GetMapping("/questionDetail/increaseViewCount/{questionNumber}")
     public ResponseEntity<String> saveViewCount(@PathVariable("questionNumber") Long id) {
     System.out.println("조회수 증가 컨트롤러 실행");
     try {
         // 조회수 증가 처리
         questionService.increaseViewCount(id);
         return ResponseEntity.ok("조회수 증가 성공");
     } catch (DataNotFoundException e) {
         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
     } catch (Exception e) {
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("조회수 증가 실패.");
     }
 }

     // 댓글 저장 엔드포인트
    @PostMapping("/questionDetail/saveAnswer")
    public void saveAnswer(@RequestBody AnswerEntity entity) {
        answerService.saveAnswer(entity);
    }

    // 삭제
    @DeleteMapping("/questionDetail/{questionNumber}")
    public ResponseEntity<String> deletequestion(@PathVariable Long questionNumber) {
        try {
            questionService.deletequestion(questionNumber);
            return ResponseEntity.ok("질문이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("질문 삭제에 실패했습니다.");
        }
    }

}
