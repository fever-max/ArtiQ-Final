package com.artiq.back.auction.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artiq.back.auction.entity.AuctionFavoriteEntity;

 public interface FavoriteRepository extends JpaRepository<AuctionFavoriteEntity, Integer> {
    Optional<AuctionFavoriteEntity> findByAcProductNo(int acProductNo);
     Optional<AuctionFavoriteEntity> findByFvUserEmailAndAcProductNo(String fvUserEmail, int acProductNo);
     List<AuctionFavoriteEntity> findByFvUserEmail(String fvUserEmail);
}
