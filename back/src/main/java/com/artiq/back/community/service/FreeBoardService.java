package com.artiq.back.community.service;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.artiq.back.community.controller.DataNotFoundException;
import com.artiq.back.community.entity.CommentEntity;
import com.artiq.back.community.entity.FreeBoardEntity;
import com.artiq.back.community.repository.CommentRepository;
import com.artiq.back.community.repository.FreeBoardRepository;

import lombok.AllArgsConstructor;
@Service
@AllArgsConstructor
public class FreeBoardService {
    private final FreeBoardRepository freeBoardRepository;
    private final CommentRepository commentRepository;
    

    // 게시글 생성
    public void saveFreeBoard(FreeBoardEntity freeBoardEntity) {
        Long maxBoardNumber = getMaxBoardNumber();
        if (maxBoardNumber == null) {
            freeBoardEntity.setBoardNumber(1L);
        } else {
            freeBoardEntity.setBoardNumber(maxBoardNumber + 1);
        }
        freeBoardRepository.save(freeBoardEntity);
    }

    // 모든 게시글 조회
    public List<FreeBoardEntity> findAllFreeBoardData(){
        return freeBoardRepository.findAll();
    }

    // 하나의 게시글 조회 
    public FreeBoardEntity getFreeBoardEntity(Long id) {
        return freeBoardRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));
    }

    // 최대 게시글 번호 조회
    public Long getMaxBoardNumber() {
        return freeBoardRepository.getMaxBoardNumber();
    }

    // 추천 수 증가 메서드
    public void incrementUpCount(Long id) {
        FreeBoardEntity board = freeBoardRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));

        int currentUpCount = board.getBoardUpCount();
        board.setBoardUpCount(currentUpCount + 1);

        if (board.getBoardDownCount() > 0) {
            board.setBoardDownCount(0);
        }
    
        freeBoardRepository.save(board);
    }

    // 추천 수 감소 메서드
    public void decrementUpCount(Long id) {
        FreeBoardEntity board = freeBoardRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));

        int currentUpCount = board.getBoardUpCount();
        board.setBoardUpCount(currentUpCount - 1);

        freeBoardRepository.save(board);
    }

    // 비추천 수 증가 메서드
    public void incrementDownCount(Long id) {
        FreeBoardEntity board = freeBoardRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));

        int currentDownCount = board.getBoardDownCount();
        board.setBoardDownCount(currentDownCount + 1);

        if (board.getBoardUpCount() > 0) {
            board.setBoardUpCount(0);
        }
    
        freeBoardRepository.save(board);
    }

    // 비추천 수 감소 메서드
    public void decrementDownCount(Long id) {
        FreeBoardEntity board = freeBoardRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));

        int currentDownCount = board.getBoardDownCount();
        board.setBoardDownCount(currentDownCount - 1);

        freeBoardRepository.save(board);
    }


    // 특정 게시글에 추천 수 조회
    public List<FreeBoardEntity> findBoardUpCountByBoardNumber(Long id) {
        return freeBoardRepository.findAllByBoardNumber(id);
    }

    // 특정 게시글에 비추천 수 조회
    public List<FreeBoardEntity> findBoardDownCountByBoardNumber(Long id) {
        return freeBoardRepository.findAllByBoardNumber(id);
    }

    // 조회수 수 증가 메서드
    public FreeBoardEntity saveViewCount(Long id) {
        return freeBoardRepository.findById(id) 
            .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));
    }

    // 조회 수 증가
    public void increaseViewCount(Long id) {
        FreeBoardEntity board = freeBoardRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));
        
        int ViewCount = board.getBoardViewCount();
        board.setBoardViewCount(ViewCount + 1);
    
        freeBoardRepository.save(board);
    }

    // 특정 게시글에 조회수 저장
    public List<FreeBoardEntity> findBoardViewCountByBoardNumber(Long id) {
        return freeBoardRepository.findAllByBoardNumber(id);
    }

    // 삭제
    @Transactional
    public void deleteBoard(Long boardNumber) {
        int boardNumber2 = Long.valueOf(boardNumber).intValue();
        commentRepository.deleteByBoardNumber(boardNumber2);
        freeBoardRepository.deleteById(boardNumber);
    }
    
    //댓글 삭제
    public void deleteCount(int commentNumber) {

        System.out.println("댓글 삭제 서비스 실행 (프리보드 엔티티 -1)");
        Optional<CommentEntity> entity = commentRepository.findByCommentNumber(commentNumber);
        Long boardNumber;

        if (entity.isPresent()) {
            System.out.println("해당 댓글 정보가 있음");
            CommentEntity commentEntity = entity.get();
            boardNumber = (long)(commentEntity.getBoardNumber());
            System.out.println("받아온 게시글 넘버: "  + boardNumber);
            Optional<FreeBoardEntity> eOptional =freeBoardRepository.findByBoardNumber(boardNumber);
            if (eOptional.isPresent()) {
                FreeBoardEntity freeBoardEntity = eOptional.get();
                int commentCount = freeBoardEntity.getBoardCommentCount();
                freeBoardEntity.setBoardCommentCount(commentCount-1);
                freeBoardRepository.save(freeBoardEntity);
            }
        }
        
    }





}
