package com.artiq.back.chat;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Data
@Table(name = "auction_chat_room")
public class ChatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, name = "rm_id")
    private String rm_id;

    @Column(length = 50, name = "user_email")
    private String userEmail;

    @Column(name = "rm_chat_time")
    private LocalDateTime timestamp;

    public ChatEntity() {
        this.timestamp = LocalDateTime.now();
    }

    @Column(length = 50, name = "rm_user")
    private String nickname;

    @Column(name = "rm_user_img")
    private String profileImage;

    @Column(length = 1000, name = "rm_msg")
    private String message;

}