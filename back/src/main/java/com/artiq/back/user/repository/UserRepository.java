package com.artiq.back.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.artiq.back.user.dto.UserDetailDto;
import com.artiq.back.user.entity.*;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUserEmail(String userEmail);

    boolean existsByUserEmail(String userEmail);

    boolean existsByUserTel(String userTel);

    Optional<UserEntity> findByUserTel(String userTel);

    @Query("SELECT new com.artiq.back.user.dto.UserDetailDto(u.userNo, u.userEmail, u.userNickname, u.userRole, COALESCE(r.rankLevel, ''), COALESCE(r.rankPoint, ''), COALESCE(s.socialPlatform, ''), u.userDate) "
            +
            "FROM UserEntity u " +
            "LEFT JOIN UserRankEntity r ON u.userEmail = r.userEmail " +
            "LEFT JOIN UserSocialEntity s ON u.userEmail = s.userEmail")
    List<UserDetailDto> findUserDetails();

    

}
