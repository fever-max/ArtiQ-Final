package com.artiq.back.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artiq.back.user.entity.UserPointEntity;
import com.artiq.back.user.entity.UserRankEntity;
import java.util.Optional;

public interface BasicRankRepository extends JpaRepository<UserRankEntity, Integer> {
    Optional<UserRankEntity> findByUserEmail(String userEmail);
    
}



