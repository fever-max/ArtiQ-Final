package com.artiq.back.user.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.service.ImgService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/myPage")
public class ImgController {

    private final ImgService imgService;

    // 사진변경 컨트롤러
    @PostMapping("/updateImg")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file,
            @RequestParam("userEmail") String userEmail) {
        System.out.println("프로필 업데이트 컨트롤러 실행");
        // String fileName = file.getOriginalFilename();
        // String contentType = file.getContentType();
        // System.out.println("fileName: " + fileName);
        // System.out.println("contentType: " + contentType);
        // System.out.println("userEmail: " + userEmail);
        try {
            imgService.updateUserImg(userEmail, file);
            return ResponseEntity.ok("User information updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user information: " + e.getMessage());
        }
    }

    // 유저 사진 정보 컨트롤러
    @GetMapping("/userProfileImage")
    public ResponseEntity<byte[]> getUserProfileImage(@RequestParam("userEmail") String userEmail) {

        System.out.println("유저 사진 정보 컨트롤러 실행");
        try {
            // 유저의 프로필 이미지 (바이트 배열)
            byte[] imageBytes = imgService.getUserProfileImage(userEmail);
            System.out.println("imageBytes" + imageBytes);
            if (imageBytes != null && imageBytes.length > 0) {
                // 이미지 바이트 배열을 바로 응답으로 전송
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG); // 이미지의 MIME 타입 설정
                return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            } else {
                // 이미지가 없는 경우 Not Found로 응답
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // 오류 발생 시 에러 응답
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 이미지 삭제 컨트롤러
    @PutMapping("/userProfileImageDelete")
    public ResponseEntity<String> deleteUserImg(@RequestBody UserEntity data) {
        String userEmail = data.getUserEmail();
        imgService.deleteUserImg(userEmail);
        return ResponseEntity.ok("이미지 삭제 성공");
    }

}
