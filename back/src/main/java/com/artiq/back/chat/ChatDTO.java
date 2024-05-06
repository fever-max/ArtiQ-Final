package com.artiq.back.chat;

import lombok.Data;

@Data
public class ChatDTO {

    private String nickname;
    private String message;
    private String profileImage;
    private String userEmail;

    // 기본 생성자, getter 및 setter 메서드

    public ChatDTO() {
    }

    public ChatDTO(String nickname, String message, String profileImage, String userEmail) {
        this.nickname = nickname;
        this.message = message;
        this.profileImage = profileImage;
        this.userEmail = userEmail;
    }

}