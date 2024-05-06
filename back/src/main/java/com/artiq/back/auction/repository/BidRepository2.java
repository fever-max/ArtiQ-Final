package com.artiq.back.auction.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artiq.back.auction.entity.BidEntity;

public interface BidRepository2 extends JpaRepository<BidEntity, Integer> {
    Optional<BidEntity> findByAcProductNoAndBidUserEmail(int acProductNo, String bidUserEmail);
    List<BidEntity> findByBidUserEmail(String bidUserEmail);
    List<BidEntity> findByAcProductNoIn(List<Integer> acProductNos);

    void deleteByAcProductNoAndBidUserEmail(int acProductNo, String bidUserEmail);

    // 특정 상품 번호에 대해 가장 높은 입찰 금액의 입찰 정보 조회
    Optional<BidEntity> findFirstByAcProductNoOrderByBidPriceDesc(int acProductNo);

    // 특정 상품에 대해 특정 사용자를 제외하고 모든 입찰 정보 조회
    List<BidEntity> findByAcProductNoAndBidUserEmailNot(int acProductNo, String bidUserEmail);

    // 여러 상품 번호에 대해 각 상품별 입찰자 수를 카운트하는 메서드
    int countByAcProductNoIn(List<Integer> acProductNo);
}