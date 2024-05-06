package com.artiq.back.community.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

import com.artiq.back.community.entity.CommentEntity;
import com.artiq.back.community.entity.FreeBoardEntity;
import com.artiq.back.community.entity.QuestionEntity;
import com.artiq.back.community.entity.VoteEntity;
import com.artiq.back.community.repository.FreeBoardRepository;
import com.artiq.back.community.repository.VoteRepository;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;
    private final FreeBoardRepository freeBoardRepository;

    //추천 체크 메서드
    public ResponseEntity<?> saveVoteUpCk(VoteEntity entity) {
        Optional<VoteEntity> optional = voteRepository.findByUserEmailAndBoardNumber(entity.getUserEmail(), entity.getBoardNumber());
        if (optional.isPresent()) {
            // 이미 추천한 경우 (보드테이블에서 추천수 -1, 추천 테이블에서 해당 내용 지움)
            Optional<FreeBoardEntity> boardOptional = freeBoardRepository.findByBoardNumber(entity.getBoardNumber());
            FreeBoardEntity boardEntity = boardOptional.get();
            int voteCount = boardEntity.getBoardUpCount();
            boardEntity.setBoardUpCount(voteCount-1);
            freeBoardRepository.save(boardEntity);

            //추천 테이블 삭제
            VoteEntity vote = optional.get();
            voteRepository.delete(vote);
            
            return ResponseEntity.noContent().build();
        } else {
            // 추천하지 않은 경우 (추천 테이블에 정보 저장)
            voteRepository.save(entity);

            // 보드 테이블에서 추천수 +1
            Optional<FreeBoardEntity> boardOptional = freeBoardRepository.findByBoardNumber(entity.getBoardNumber());
            FreeBoardEntity boardEntity = boardOptional.get();
            int voteCount = boardEntity.getBoardUpCount();
            boardEntity.setBoardUpCount(voteCount+1);
            freeBoardRepository.save(boardEntity);

            return ResponseEntity.ok().body("게시물을 성공적으로 추천했습니다.");
        }
    }

    // 비추천 체크 메서드
    public ResponseEntity<?> saveVoteDownCk(VoteEntity entity) {
        Optional<VoteEntity> optional = voteRepository.findByUserEmailAndBoardNumber(entity.getUserEmail(), entity.getBoardNumber());
        if (optional.isPresent()) {
            // 이미 비추천한 경우 (보드테이블에서 추천수 -1, 추천 테이블에서 해당 내용 지움)
            Optional<FreeBoardEntity> boardOptional = freeBoardRepository.findByBoardNumber(entity.getBoardNumber());
            FreeBoardEntity boardEntity = boardOptional.get();
            int voteCount = boardEntity.getBoardDownCount();
            boardEntity.setBoardDownCount(voteCount-1);
            freeBoardRepository.save(boardEntity);

            //추천 테이블 삭제
            VoteEntity vote = optional.get();
            voteRepository.delete(vote);
            
            return ResponseEntity.noContent().build();
        } else {
            // 추천하지 않은 경우 (추천 테이블에 정보 저장)
            voteRepository.save(entity);

            // 보드 테이블에서 비추천수 +1
            Optional<FreeBoardEntity> boardOptional = freeBoardRepository.findByBoardNumber(entity.getBoardNumber());
            FreeBoardEntity boardEntity = boardOptional.get();
            int voteCount = boardEntity.getBoardDownCount();
            boardEntity.setBoardDownCount(voteCount+1);
            freeBoardRepository.save(boardEntity);

            return ResponseEntity.ok().body("게시물을 성공적으로 비추천했습니다.");
        }
    }
    
}
