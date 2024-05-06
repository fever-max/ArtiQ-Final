package com.artiq.back.community.controller;

import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.artiq.back.community.entity.CommentEntity;
import com.artiq.back.community.entity.FreeBoardEntity;
import com.artiq.back.community.repository.CommentRepository;
import com.artiq.back.community.service.CommentService;
import com.artiq.back.community.service.FreeBoardService;

@RestController
public class CommentController {
    
    private final CommentService commentService;
    private final FreeBoardService freeBoardService;  
    private final CommentRepository commentRepository;

    
    @Autowired
    public CommentController(CommentService commentService,FreeBoardService freeBoardService, CommentRepository commentRepository) {
        this.commentService = commentService;
        this.freeBoardService = freeBoardService;
        this.commentRepository = commentRepository;
    }

    // 자유게시판 댓글 생성
    @PostMapping("/comments")
    public ResponseEntity<String> createComment(@RequestBody CommentEntity comment) {
        commentService.saveComment(comment);
        return ResponseEntity.ok("댓글이 저장되었습니다.");
    }

    
    
    // 댓글 삭제
    @DeleteMapping("/comments/{commentNumber}")
    public ResponseEntity<String> deleteComment(@PathVariable int commentNumber) {
        try {
            //보드 엔티티 댓글수 삭제
            freeBoardService.deleteCount(commentNumber);
            //댓글 엔티티 삭제
            commentService.deleteComment(commentNumber);
    
            return ResponseEntity.ok("댓글이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 삭제에 실패했습니다.");
        }
    }
    
    
    // 자유게시판 전체 댓글 조회
    @GetMapping("/comments/board/{boardNumber}")
    public List<CommentEntity> getCommentsByBoardNumber(@PathVariable int boardNumber) {
        return commentService.findCommentsByBoardNumber(boardNumber);
    }

}
