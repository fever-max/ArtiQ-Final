package com.artiq.back.matching.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artiq.back.matching.entity.ExpertRequestEntity;

@Repository
public interface AppraiseFinRepository extends JpaRepository<ExpertRequestEntity, Integer> {

    // 이메일로 감정사 있나 여부 확인
    Optional<ExpertRequestEntity> findByUserEmail(String userEmail);

}
