package com.artiq.back.chat;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.auction.entity.AuctionEntity;
import com.artiq.back.config.security.JwtTokenProvider;
import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
public class ChatController {

    private final JwtTokenProvider jwtTokenProvider;
    private final ChatService chatService;
    private final UserService userService;

    // 닉네임불러오기
    @GetMapping("/chat/nickname")
    public ResponseEntity<Map<String, Object>> getUserNickname(HttpServletRequest request) {

        // 쿠키에서 JWT 토큰 가져오기
        String jwtToken = getUserJwtToken(request);

        Map<String, Object> response = new HashMap<>();
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);

        System.out.println("이메일: " + userEmail);
        String nickname = jwtTokenProvider.getUserNickname(jwtToken);
        UserEntity userEntity = userService.findByUserInfos(userEmail);
        String userimg = userEntity.getUserProfile();
        response.put("nickname", nickname);
        response.put("userEmail", userEmail);
        response.put("userimg", userimg);

        return ResponseEntity.ok(response);
    }

    // @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/chat/data")
    public ResponseEntity<String> sendMessage(@RequestBody ChatDTO chatDTO) {
        try {
            // 클라이언트로부터 전송된 데이터 수신
            String nickname = chatDTO.getNickname();
            String message = chatDTO.getMessage();
            String profileImage = chatDTO.getProfileImage();
            String userEmail = chatDTO.getUserEmail();

            // System.out.println("*******************");
            // System.out.println(profileImage);
            // System.out.println("*******************");

            // 채팅 서비스를 통해 메시지 처리 및 저장
            chatService.saveMessage(nickname, message, profileImage, userEmail);

            // 성공적인 응답 반환
            return ResponseEntity.ok("Message sent successfully");
        } catch (Exception e) {
            // 오류 발생 시 예외 처리
            log.error("Error sending message: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending message");
        }
    }

    private String getUserJwtToken(HttpServletRequest request) {
        String jwtToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("jwtToken")) {
                    jwtToken = cookie.getValue();
                    break;
                }
            }
        }
        return jwtToken;
    }

    // @PostMapping("/ws/chat/1")
    // public ResponseEntity<String> updateBidPrice(@RequestBody AuctionEntity
    // price) {
    // try {
    // // 클라이언트에서 전송한 입찰가를 가져와서 DB를 업데이트합니다.
    // chatService.updatePrice(price);
    // return ResponseEntity.ok("입찰가가 성공적으로 업데이트되었습니다.");
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    // .body("입찰가 업데이트 중 오류가 발생했습니다.");
    // }
    // }
}