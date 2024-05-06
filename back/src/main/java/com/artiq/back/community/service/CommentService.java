package com.artiq.back.community.service;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.artiq.back.community.entity.CommentEntity;
import com.artiq.back.community.entity.FreeBoardEntity;
import com.artiq.back.community.entity.QuestionEntity;
import com.artiq.back.community.repository.CommentRepository;
import com.artiq.back.community.repository.FreeBoardRepository;
import com.artiq.back.community.repository.QuestionRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final FreeBoardRepository freeBoardRepository;

    // 새로운 댓글 저장
    public void saveComment(CommentEntity comment) {

        // 댓글 저장
        commentRepository.save(comment);

        // 게시글 엔티티 댓글 갯수+1
        Optional<FreeBoardEntity> optionalEntity = freeBoardRepository.findById((long) comment.getBoardNumber());
        if (optionalEntity.isPresent()) {
            FreeBoardEntity entity = optionalEntity.get();
            entity.setBoardCommentCount(entity.getBoardCommentCount() + 1);
            freeBoardRepository.save(entity);
        }

    }

    // 특정 게시글에 대한 댓글 목록 조회
    public List<CommentEntity> findCommentsByBoardNumber(int boardNumber) {
        return commentRepository.findByBoardNumber(boardNumber);
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(int commentNumber) {
        System.out.println("댓글 삭제 서비스 실행 (댓글 엔티티 삭제)");
        commentRepository.deleteById(commentNumber);
    }

}
