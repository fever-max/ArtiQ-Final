package com.artiq.back.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.artiq.back.auction.entity.AuctionEntity;
import com.artiq.back.auction.repository.AuctionRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final AuctionRepository auctionRepository;

    // 메시지 저장 메서드
    public void saveMessage(String nickname, String message, String profileImage, String userEmail) {
        // ChatEntity 객체 생성
        ChatEntity chatEntity = new ChatEntity();
        chatEntity.setNickname(nickname);
        chatEntity.setMessage(message);
        chatEntity.setProfileImage(profileImage);
        chatEntity.setUserEmail(userEmail);
        // ChatEntity를 저장소에 저장
        chatRepository.save(chatEntity);
    }

    // 웹소켓을 이용해 금액 현재가 업데이트
    public void updatePrice(AuctionEntity price) {
        AuctionEntity Price = auctionRepository.findById(1).orElse(null);
        if (Price != null) {
            Price.setAc_now_price(price.getAc_now_price());
            auctionRepository.save(Price);
        }
    }
}