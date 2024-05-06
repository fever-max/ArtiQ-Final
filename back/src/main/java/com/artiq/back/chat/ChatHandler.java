package com.artiq.back.chat;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.artiq.back.auction.entity.AuctionEntity;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
public class ChatHandler extends TextWebSocketHandler {

    private ChatService chatService;

    @Autowired
    public ChatHandler(ChatService chatService) {
        this.chatService = chatService;
    }

    // String형태 json 형변환해주는애
    @Autowired
    private ObjectMapper objectMapper;

    private static List<WebSocketSession> list = new ArrayList<>();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("payload : " + payload);

        // payload에 ac_now_price가 포함되어 있는지 확인
        // 메세지값까지 객체변환하면 프론트로 반환이 안됨
        if (payload.contains("ac_now_price")) {
            // JSON 문자열 payload을 AuctionEntity 객체로 변환
            AuctionEntity auctionEntity = objectMapper.readValue(payload, AuctionEntity.class);

            // DB 업데이트
            chatService.updatePrice(auctionEntity);
            String acNowPrice = auctionEntity.getAc_now_price();

            String bidMessage = "{\"UserName\": \"" + acNowPrice + "원에 입찰되었습니다\"}";

            // String jsonBidMessage = objectMapper.writeValueAsString(BidMessage);
            TextMessage customMessage = new TextMessage(bidMessage);

            // 해당 변수를 사용하여 메시지 전송
            for (WebSocketSession sess : list) {
                sess.sendMessage(customMessage);
            }
        } else {

            for (WebSocketSession sess : list) {
                sess.sendMessage(message);
            }
        }
    }

    /* Client가 접속 시 호출되는 메서드 */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        list.add(session);
        log.info(session + " 클라이언트 접속");
    }
    /* Client가 접속 해제 시 호출되는 메서드드 */

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info(session + " 클라이언트 접속 해제");
        list.remove(session);
    }

}