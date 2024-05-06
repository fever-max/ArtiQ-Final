package com.artiq.back.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.artiq.back.community.entity.FreeBoardEntity;
import com.artiq.back.community.entity.QuestionEntity;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionEntity, Long>{
    void deleteByQuestionNumber(Long questionNumber);
    List<QuestionEntity> findAllByQuestionNumber(Long questionNumber);
    Optional<QuestionEntity> findByQuestionNumber(Long questionNumber);

    // 최대 게시물 번호 가져오기
    @Query("SELECT MAX(f.questionNumber) FROM QuestionEntity f")
    Long getMaxQuestionNumber();

    

    
    
}
