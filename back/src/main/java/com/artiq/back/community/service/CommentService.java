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
        commentRepository.save(comment);

        Optional<FreeBoardEntity> optionalEntity = freeBoardRepository.findById((long) comment.getBoardNumber());
    if (optionalEntity.isPresent()) {
        FreeBoardEntity entity = optionalEntity.get();
        entity.setBoardCommentCount(comment.getCommentNumber());
        // 수정하고자 하는 필드가 기존 값과 다를 경우에만 설정
        if (entity.getBoardNumber() != comment.getBoardNumber()) {
            entity.setBoardNumber((long) comment.getBoardNumber());
        }
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
