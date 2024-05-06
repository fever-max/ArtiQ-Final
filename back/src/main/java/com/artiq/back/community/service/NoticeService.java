package com.artiq.back.community.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.artiq.back.community.controller.DataNotFoundException;
import com.artiq.back.community.entity.NoticeEntity;
import com.artiq.back.community.entity.QuestionEntity;
import com.artiq.back.community.repository.NoticeRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

     // 게시글 생성
    public void saveNoticeBoard(NoticeEntity noticeEntity) {
            Long maxNoticeNumber = getMaxNoticeNumber();
            if (maxNoticeNumber == null) {
                noticeEntity.setNoticeNumber(1L);
            } else {
                noticeEntity.setNoticeNumber(maxNoticeNumber + 1);
            }
            noticeRepository.save(noticeEntity);
        } 
    

    public List<NoticeEntity> findAllNoticeData() {
        return noticeRepository.findAll();
    }

    

    public NoticeEntity getNoticeEntity(Long id) {
        return noticeRepository.findById(id).orElse(null); // 데이터가 없을 때 null 반환
    }

    // 최대 게시글 번호 조회
    public Long getMaxNoticeNumber() {
        return noticeRepository.getMaxNoticeNumber();
    }

    // 조회수 수 증가 메서드
    public NoticeEntity saveViewCount(Long id) {
        return noticeRepository.findById(id) 
            .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));
    }

    // 조회 수 증가
    public void increaseViewCount(Long id) {
        NoticeEntity board = noticeRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("해당하는 게시글이 없습니다. ID: " + id));
        
        int ViewCount = board.getNoticeViewCount();
        board.setNoticeViewCount(ViewCount + 1);
    
        noticeRepository.save(board);
    }

    // 특정 게시글에 조회수 저장
    public List<NoticeEntity> findNoticeViewCountByNoticeNumber(Long id) {
        return noticeRepository.findByNoticeNumber(id);
    }

    // 삭제
    @Transactional
    public void deleteBoard(Long noticeNumber) {
        noticeRepository.deleteById(noticeNumber);
    }



}
