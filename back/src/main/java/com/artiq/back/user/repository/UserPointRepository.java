package com.artiq.back.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artiq.back.user.entity.*;

public interface UserPointRepository extends JpaRepository<UserPointEntity, Integer> {

    Optional<UserPointEntity> findByUserEmail(String userEmail);

    Optional<UserPointEntity> findByPointCertify(String pointCertify);

    List<UserPointEntity> findAllByUserEmail(String userEmail);

}
