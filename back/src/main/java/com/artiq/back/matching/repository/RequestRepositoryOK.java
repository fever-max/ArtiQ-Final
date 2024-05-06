package com.artiq.back.matching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import com.artiq.back.matching.entity.RequestOKEntity;

@Repository
public interface RequestRepositoryOK extends JpaRepository<RequestOKEntity, Integer> {

    // 이메일로 감정사 여부 확인
    Optional<RequestOKEntity> findByUserEmail(String userEmail);

    // 이메일로 의뢰자 여부 확인
    Optional<RequestOKEntity> findByReqUserEmail(String reqUserEmail);
}
