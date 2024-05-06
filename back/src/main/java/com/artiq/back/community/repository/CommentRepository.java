package com.artiq.back.community.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artiq.back.community.entity.CommentEntity;

public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {
    
    List<CommentEntity> findByBoardNumber(int boardNumber);
    void deleteByBoardNumber(int boardNumber);

    Optional<CommentEntity> findByCommentNumber(int commentNumber);
  
}
