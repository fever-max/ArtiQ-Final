package com.artiq.back.auction.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.artiq.back.auction.entity.ArtDataEntity;

public interface ArtDataRepository extends JpaRepository<ArtDataEntity, Integer> {
    //기범추가
    List<ArtDataEntity> findByArtIdIn(List<Integer> artIds);
}