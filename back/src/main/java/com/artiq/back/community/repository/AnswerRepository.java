package com.artiq.back.community.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artiq.back.community.entity.AnswerEntity;

public interface AnswerRepository extends JpaRepository<AnswerEntity, Integer> {
    
    List<AnswerEntity> findByQuestionNumber(int questionNumber);
    void deleteByQuestionNumber(int questionNumber);

    Optional<AnswerEntity> findByAnswerNumber(int answerNumber);

}
