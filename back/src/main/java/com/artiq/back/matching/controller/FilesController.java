package com.artiq.back.matching.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.artiq.back.matching.entity.ExpertRequestEntity;
import com.artiq.back.matching.service.FileService;
import java.util.*;

@RestController
@RequestMapping("/api")
public class FilesController {

    private final FileService fileService;

    public FilesController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/checkEmail")
    public ResponseEntity<String> checkExpertRequest(@RequestParam String userEmail) {
        System.out.println(userEmail + "1111111111111111111111111111111111111111111111111");
        Optional<ExpertRequestEntity> result = fileService.checkEmail(userEmail);
        if (result.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body("EXIST");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body("NOT_EXIST");
        }
    }

    @PostMapping("/uploads")
    public String handleFileUpload(@RequestParam("file") MultipartFile file,
            @RequestParam("userEmail") String userEmail,
            @RequestParam("reField") String reField,
            @RequestParam("apCareer") String apCareer,
            @RequestParam("apMassage") String apMassage,
            @RequestParam("userName") String userName,
            @RequestParam("reGenre1") String reGenre1,
            @RequestParam("reGenre2") String reGenre2,
            @RequestParam("reGenre3") String reGenre3,
            @RequestParam("reGenre4") String reGenre4,
            @RequestParam("reGenre5") String reGenre5) {
        System.out.println("감정사 신청 컨트롤러 실행");
        try {

            fileService.addExpertRequestEntity(file, userEmail, reField, apCareer, apMassage, userName, reGenre1,
                    reGenre2,
                    reGenre3, reGenre4, reGenre5);

            return "ooooo";
        } catch (Exception e) {

            e.printStackTrace();
            return "xxxxxx";
        }
    }

    @GetMapping("/file")
    public String getExpertRequestEntity(@RequestParam int apNo) {

        ExpertRequestEntity expertRequestEntity = fileService.findExpertRequestEntity(apNo)
                .orElseThrow(RuntimeException::new);

        String imgPath = expertRequestEntity.getSaveFileName();
        System.out.println(imgPath);

        return "<img src=\"" + imgPath + "\">";
    }

}