package com.artiq.back.chat;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ChatRepository extends JpaRepository<ChatEntity, Long> {
    
}
