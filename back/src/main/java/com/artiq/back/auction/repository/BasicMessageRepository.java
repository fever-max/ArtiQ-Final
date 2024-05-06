package com.artiq.back.auction.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.artiq.back.auction.entity.BasicMessageEntity;

public  interface BasicMessageRepository extends JpaRepository<BasicMessageEntity, Integer>  {

    List<BasicMessageEntity> findByUserEmailAndIsReadFalse(String userEmail);
    
}
