package com.artiq.back.auction.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.artiq.back.auction.entity.ArtDataEntity2;

import java.time.LocalDateTime;
import java.util.List;

public interface ArtDataRepository2 extends JpaRepository<ArtDataEntity2, Integer> {
    List<ArtDataEntity2> findByArtId2(Integer artId2);
    List<ArtDataEntity2> findByArtId2In(List<Integer> artIds); 
    List<ArtDataEntity2> findByBasicEndTimeBeforeAndIsProcessedFalse(LocalDateTime endTime);
}

