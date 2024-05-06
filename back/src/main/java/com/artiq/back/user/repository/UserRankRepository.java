package com.artiq.back.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artiq.back.user.entity.*;

public interface UserRankRepository extends JpaRepository<UserRankEntity, Integer> {

    Optional<UserRankEntity> findByUserEmail(String userEmail);

}
