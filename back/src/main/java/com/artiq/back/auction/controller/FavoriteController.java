package com.artiq.back.auction.controller;

import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.auction.entity.AuctionFavoriteEntity;
import com.artiq.back.auction.service.FavoriteService;
import com.artiq.back.config.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class FavoriteController {
     
     private final FavoriteService favoriteService;
     private final JwtTokenProvider jwtTokenProvider;

    //관심 등록(1값시 save 그외 delete)
    @PostMapping("/BasicAuction/favorite")
    public void getFavorInfo(@RequestBody AuctionFavoriteEntity favorInfo) {
        System.out.println(favorInfo.getFavoriteStatus());
        if(favorInfo.getFavoriteStatus()==1){
            favoriteService.saveFavor(favorInfo);
        }else{
            favoriteService.deleteFavor(favorInfo);
        }
    }

    //페이지로딩시 관심등록여부 확인용
    @PostMapping("/BasicAuction/favorExist")
    public ResponseEntity<AuctionFavoriteEntity> getFavorExist(@RequestBody AuctionFavoriteEntity favorInfo) {
        AuctionFavoriteEntity af =  favoriteService.existFavor(favorInfo);
        return ResponseEntity.ok(af);
    }


    //마이페이지 관심물품목록
    @GetMapping("/myPage/likeData")
    public ResponseEntity<Map<String, Object>> getLikeData(HttpServletRequest request) {
        String jwtToken = getUserJwtToken(request);
        String userEmail = jwtTokenProvider.getUserEmail(jwtToken);
       
        Map<String, Object> auctionData = favoriteService.findLikeData(userEmail);
        
        return ResponseEntity.ok(auctionData);
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
}
