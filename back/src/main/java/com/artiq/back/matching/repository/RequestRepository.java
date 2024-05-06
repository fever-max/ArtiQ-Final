package com.artiq.back.matching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import com.artiq.back.matching.entity.RequestEntity;

@Repository
public interface RequestRepository extends JpaRepository<RequestEntity, Integer> {

    // 이메일로 감정사 여부 확인
    Optional<RequestEntity> findByUserEmail(String userEmail);

    // 이메일로 의뢰자 여부 확인
    Optional<RequestEntity> findByReqUserEmail(String reqUserEmail);
}
