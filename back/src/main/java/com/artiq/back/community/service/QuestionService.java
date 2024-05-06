package com.artiq.back.community.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import com.artiq.back.community.controller.DataNotFoundException;
import com.artiq.back.community.entity.AnswerEntity;
import com.artiq.back.community.entity.QuestionEntity;
import com.artiq.back.community.repository.AnswerRepository;
import com.artiq.back.community.repository.QuestionRepository;
import com.artiq.back.community.repository.VoteRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final VoteRepository voteRepository;

    // 게시글 생성
    public void saveQuestionBoard(QuestionEntity questionEntity) {
        Long maxQuestionNumber = getMaxQuestionNumber();
        if (maxQuestionNumber == null) {
            questionEntity.setQuestionNumber(1L);
        } else {
            questionEntity.setQuestionNumber(maxQuestionNumber + 1);
        }
        questionRepository.save(questionEntity);
    }

    // 모든 게시글 조회
    public List<QuestionEntity> findAllQuestionData() {
        return questionRepository.findAll();
    }

    // 하나의 게시글 조회 
    public QuestionEntity getQuestionEntity(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));
    }

    // 최대 게시글 번호 조회
    public Long getMaxQuestionNumber() {
        return questionRepository.getMaxQuestionNumber();
    }

    // 조회수 수 증가 메서드
    public QuestionEntity saveViewCount(Long id) {
        return questionRepository.findById(id) 
            .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));
    }

    // 조회 수 증가
    public void increaseViewCount(Long id) {
        QuestionEntity board = questionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));
        
        int ViewCount = board.getQuestionViewCount();
        board.setQuestionViewCount(ViewCount + 1);
    
        questionRepository.save(board);
    }

    // 특정 게시글에 조회수 저장
    public List<QuestionEntity> findQuestionViewCountByQuestionNumber(Long id) {
        return questionRepository.findAllByQuestionNumber(id);
    }

    // 삭제
    @Transactional
    public void deletequestion(Long questionNumber) {
        int questionNumber2 = Long.valueOf(questionNumber).intValue();
        answerRepository.deleteByQuestionNumber(questionNumber2);
        questionRepository.deleteById(questionNumber);
    }

    //댓글 삭제
    public void deleteCount(int answerNumber) {

        System.out.println("답글 삭제 서비스 실행 (프리보드 엔티티 -1)");
        Optional<AnswerEntity> entity = answerRepository.findByAnswerNumber(answerNumber);
        Long questionNumber;

        if (entity.isPresent()) {
            System.out.println("해당 댓글 정보가 있음");
            AnswerEntity answerEntity = entity.get();
            questionNumber = (long)(answerEntity.getQuestionNumber());
            System.out.println("받아온 게시글 넘버: "  + questionNumber);
            Optional<QuestionEntity> eOptional =questionRepository.findByQuestionNumber(questionNumber);
            if (eOptional.isPresent()) {
                QuestionEntity questionEntity = eOptional.get();
                int answerCount = questionEntity.getQuestionAnswerCount();
                questionEntity.setQuestionAnswerCount(answerCount-1);
                questionRepository.save(questionEntity);
            }
        }
    }
}
