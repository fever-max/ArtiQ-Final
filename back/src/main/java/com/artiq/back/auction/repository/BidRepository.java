package com.artiq.back.auction.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.artiq.back.auction.entity.BidEntity;

public interface BidRepository extends JpaRepository<BidEntity, Integer> {
    Optional<BidEntity> findByBidUserEmail(String bidUserEmail);
}
