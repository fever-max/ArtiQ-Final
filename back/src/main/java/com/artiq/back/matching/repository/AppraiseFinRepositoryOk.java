package com.artiq.back.matching.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.artiq.back.matching.entity.ExpertRequestEntityOk;

@Repository
public interface AppraiseFinRepositoryOk extends JpaRepository<ExpertRequestEntityOk, Integer> {
    // 이메일로 감정사 있나 여부 확인
    Optional<ExpertRequestEntityOk> findByUserEmail(String userEmail);

    @Query("SELECT e FROM ExpertRequestEntityOk e WHERE e.reField = :reField AND (:reGenre IN (e.reGenre1, e.reGenre2, e.reGenre3, e.reGenre4, e.reGenre5))")
    List<ExpertRequestEntityOk> findByReFieldAndReGenre(@Param("reField") String reField,
            @Param("reGenre") String reGenre);

}
