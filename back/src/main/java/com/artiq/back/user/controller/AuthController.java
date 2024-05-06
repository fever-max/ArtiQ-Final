package com.artiq.back.user.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.service.*;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user/auth")
public class AuthController {

    private final AuthService authService;

    // 회원가입 (/api/user/auth/join)
    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody UserEntity user) {
        return authService.join(user);
    }

    @PostMapping("/checkEmail")
    public boolean checkEmail(@RequestBody UserEntity user) {
        return authService.checkEmail(user.getUserEmail());
    }

    @PostMapping("/checkTel")
    public boolean checkTel(@RequestBody UserEntity user) {
        return authService.checkTel(user.getUserTel());
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserEntity user, HttpServletResponse response) {
        return authService.login(user, response);
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        // JSESSIONID 쿠키 삭제
        response.setHeader("Set-Cookie", "JSESSIONID=; Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure");
        // 토큰 쿠키 삭제
        response.setHeader("Set-Cookie", "jwtToken=; Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure");
    }

    // 휴대폰 번호로 이메일 찾기
    @PostMapping("/find_email")
    public ResponseEntity<String> findEmail(@RequestBody UserEntity user) {
        return authService.findEmailByUserTel(user);
    }

    // 휴대전화, 이메일로 비밀번호 찾기
    @PostMapping("/find_password")
    public ResponseEntity<String> findPwd(@RequestBody UserEntity user) {
        return authService.findPwdByUser(user);
    }

}
