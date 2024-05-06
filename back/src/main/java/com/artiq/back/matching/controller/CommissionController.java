package com.artiq.back.matching.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.artiq.back.matching.entity.RequestEntity;
import com.artiq.back.matching.service.CommissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/commission")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionService commissionService;
    
    @PostMapping("/uploads")
    public String handleCommissionUpload(@RequestParam("file") MultipartFile file,
                                   @RequestParam("reGenre") String reGenre,
                                   @RequestParam("reField") String reField,
                                   @RequestParam("reqUserEmail") String reqUserEmail,
                                   @RequestParam("userName") String userName,
                                   @RequestParam("reArtwork") String reArtwork,
                                   @RequestParam("reArtist") String reArtist,
                                   @RequestParam("reSize") String reSize,
                                   @RequestParam("reProductYear") String reProductYear,
                                   @RequestParam("reDetails") String reDetails,
                                   @RequestParam("userEmail") String email) {
        try {

            commissionService.addRequestEntity(file,reqUserEmail,userName,reArtwork,reArtist,reSize,reProductYear,reDetails,reField,reGenre,email);

            return "ooooo";
        } catch (Exception e) {
            
            e.printStackTrace();
            return "xxxxxx";
        }
    }

    @GetMapping("/file")
    public String getRequestEntity(@RequestParam int reOrderNo) {

        RequestEntity requestEntity = commissionService.findRequestEntity(reOrderNo).orElseThrow(RuntimeException::new);

        String imgPath = requestEntity.getSaveFileName();
        System.out.println(imgPath);

        return "<img src=\"" + imgPath + "\">";
    }
}
