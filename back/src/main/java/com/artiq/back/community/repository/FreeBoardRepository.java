package com.artiq.back.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

import com.artiq.back.community.entity.FreeBoardEntity;
import java.util.List;

@Repository
public interface FreeBoardRepository extends JpaRepository<FreeBoardEntity, Long> {
    void deleteByBoardNumber(Long boardNumber);

    List<FreeBoardEntity> findAllByBoardNumber(Long boardNumber);

    Optional<FreeBoardEntity> findByBoardNumber(Long boardNumber);

    // 최대 게시물 번호 가져오기
    @Query("SELECT MAX(f.boardNumber) FROM FreeBoardEntity f")
    Long getMaxBoardNumber();

}
