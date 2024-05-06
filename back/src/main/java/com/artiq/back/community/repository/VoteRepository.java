package com.artiq.back.community.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artiq.back.community.entity.VoteEntity;


@Repository
public interface VoteRepository  extends JpaRepository<VoteEntity, Long> {

    // List<VoteEntity> findByBoardNumber(int boardNumber);
    // void CreateByBoardNumber(int boardNumber);
    
    Optional<VoteEntity> findByUserEmailAndBoardNumber(String userEmail, Long boardNumber);
}
