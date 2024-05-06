package com.artiq.back.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.artiq.back.community.entity.NoticeEntity;

@Repository
public interface NoticeRepository extends JpaRepository<NoticeEntity, Long>{
    void deleteByNoticeNumber(Long noticeNumber);
    List<NoticeEntity> findByNoticeNumber(Long noticeNumber);

    // 최대 게시물 번호 가져오기
    @Query("SELECT MAX(f.noticeNumber) FROM NoticeEntity f")
    Long getMaxNoticeNumber();
    
}
