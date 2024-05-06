package com.artiq.back.community.service;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.artiq.back.community.entity.AnswerEntity;
import com.artiq.back.community.entity.CommentEntity;
import com.artiq.back.community.entity.QuestionEntity;
import com.artiq.back.community.repository.AnswerRepository;
import com.artiq.back.community.repository.QuestionRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AnswerService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    // 새로운 답글 저장
    public void saveAnswer(AnswerEntity answer) {

        // 댓글저장
        answerRepository.save(answer);

        // 게시글 엔티티 댓글 갯수+1
        Optional<QuestionEntity> optional = questionRepository.findById((long) answer.getQuestionNumber());
        if (optional.isPresent()) {
            QuestionEntity entity = optional.get();
            entity.setQuestionAnswerCount(entity.getQuestionAnswerCount() + 1);
            questionRepository.save(entity);
        }

    }

    // 특정 게시글에 대한 답글 목록 조회
    public List<AnswerEntity> findAnswersByQuestionNumber(int questionNumber) {
        List<AnswerEntity> answers = answerRepository.findByQuestionNumber(questionNumber);

        // 각 댓글의 채택 상태를 확인하고, null이 아니면 채택으로 처리
        for (AnswerEntity answer : answers) {
            if (Boolean.TRUE.equals(answer.isAccepted())) {
                answer.setAccepted(true);
            } else {
                answer.setAccepted(false);
            }
        }

        return answers;
    }

    // 질문 채택
    public boolean isAnswerAccepted(int answerNumber) {
        Optional<AnswerEntity> answerOptional = answerRepository.findByAnswerNumber(answerNumber);
        return answerOptional.isPresent() && answerOptional.get().isAccepted();
    }

    // 답글 삭제
    @Transactional
    public void deleteAnswer(int answerNumber) {
        System.out.println("답글 삭제 서비스 실행 (답글 엔티티 삭제)");
        answerRepository.deleteById(answerNumber);
    }

}
