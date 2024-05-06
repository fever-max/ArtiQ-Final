package com.artiq.back.community.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.community.entity.VoteEntity;
import com.artiq.back.community.service.FreeBoardService;
import com.artiq.back.community.service.VoteService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class VoteController {

    private final VoteService voteService;
    private final FreeBoardService freeBoardService;

    @Autowired
    public VoteController(VoteService voteService,FreeBoardService freeBoardService) {
        this.voteService = voteService;
        this.freeBoardService = freeBoardService;
        
    }

    // 추천
    @PostMapping("/freeBoardDetail/upCount")
    public ResponseEntity<?> saveUpVote(@RequestBody VoteEntity entity) {
        System.out.println("추천 컨트롤러 실행");
        System.out.println("넘어온 보드" + entity.getBoardNumber());
        System.out.println("넘어온 유저 이메일" + entity.getUserEmail());
    
        ResponseEntity<?> data = voteService.saveVoteUpCk(entity);

        return ResponseEntity.ok(data);
    }

    // 추천
    @PostMapping("/freeBoardDetail/downCount")
    public ResponseEntity<?> saveDownVote(@RequestBody VoteEntity entity) {
        System.out.println("추천 컨트롤러 실행");
        System.out.println("넘어온 보드" + entity.getBoardNumber());
        System.out.println("넘어온 유저 이메일" + entity.getUserEmail());
    
        ResponseEntity<?> data = voteService.saveVoteDownCk(entity);

        return ResponseEntity.ok(data);
    }
    
    
}
