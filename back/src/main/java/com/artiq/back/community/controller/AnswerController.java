package com.artiq.back.community.controller;

import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.community.entity.AnswerEntity;
import com.artiq.back.community.entity.CommentEntity;
import com.artiq.back.community.repository.AnswerRepository;
import com.artiq.back.community.repository.CommentRepository;
import com.artiq.back.community.service.AnswerService;
import com.artiq.back.community.service.CommentService;
import com.artiq.back.community.service.FreeBoardService;
import com.artiq.back.community.service.QuestionService;

@RestController
public class AnswerController {

    private final QuestionService questionService;
    private final AnswerService answerService;
    private final AnswerRepository answerRepository;

    @Autowired
    public AnswerController(QuestionService questionService, AnswerService answerService, AnswerRepository answerRepository) {
        this.questionService = questionService;
        this.answerService = answerService;
        this.answerRepository = answerRepository;
    }

    // 질문게시판 답글 생성
    @PostMapping("/answer")
    public ResponseEntity<String> createAnswer(@RequestBody AnswerEntity answer) {
        answerService.saveAnswer(answer);
        return ResponseEntity.ok("답글이 저장되었습니다.");
    }

    // 답글 삭제
    @DeleteMapping("/answers/{answerNumber}")
    public ResponseEntity<String> deleteAnswer(@PathVariable int answerNumber) {
        try {
            // QuestionEntity 댓글수 삭제
            questionService.deleteCount(answerNumber);
            // 답글 엔티티 삭제
            answerService.deleteAnswer(answerNumber);
    
            return ResponseEntity.ok("댓글이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 삭제에 실패했습니다.");
        }
    }
    
    // 질문게시판 전체 답글 조회
    @GetMapping("/answers/question/{questionNumber}")
    public List<AnswerEntity> getAnswerByQuestionNumber(@PathVariable int questionNumber) {
        return answerService.findAnswersByQuestionNumber(questionNumber);
    }

    // 답글 채택
    @GetMapping("/answers/isAccepted/{answerNumber}")
    public boolean isAnswerAccepted(@PathVariable int answerNumber) {
        return answerService.isAnswerAccepted(answerNumber);
    }

     // 답글 채택 처리
    @PutMapping("/answers/{answerNumber}/accept")
    public ResponseEntity<String> acceptAnswer(@PathVariable int answerNumber) {
        try {
            AnswerEntity answer = answerRepository.findByAnswerNumber(answerNumber)
                    .orElseThrow(() -> new EntityNotFoundException("Answer not found"));

            answer.setAccepted(true); // 채택 여부를 true로 업데이트

            answerRepository.save(answer); // 업데이트된 답글을 저장

            return ResponseEntity.ok("Answer accepted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to accept answer");
        }
    }
    
}
