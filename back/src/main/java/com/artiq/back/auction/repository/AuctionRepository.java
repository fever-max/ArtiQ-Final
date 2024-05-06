package com.artiq.back.auction.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.artiq.back.auction.entity.AuctionEntity;

public interface AuctionRepository extends JpaRepository<AuctionEntity, Integer> {

}
