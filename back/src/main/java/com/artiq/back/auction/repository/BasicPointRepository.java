package com.artiq.back.auction.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.artiq.back.user.entity.UserPointEntity;

public interface BasicPointRepository extends JpaRepository<UserPointEntity, Integer> {
    Optional<UserPointEntity> findByUserEmail(String userEmail);

    Optional<UserPointEntity> findByUserEmailAndPointCertify(String userEmail, String pointCertify);

    void deleteByUserEmailAndPointCertify(String userEmail, String pointCertify);
}
