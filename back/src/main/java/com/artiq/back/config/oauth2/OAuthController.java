package com.artiq.back.config.oauth2;

import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.artiq.back.user.repository.UserRepository;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/oauth2")
public class OAuthController {

    private final OAuthService oauthService;
    private final UserRepository userRepository;

    public OAuthController(OAuthService oauthService, UserRepository userRepository) {
        this.oauthService = oauthService;
        this.userRepository = userRepository;
    }

    @PostMapping("/naver")
    public ResponseEntity<?> handleNaverLogin(@RequestBody Map<String, String> requestBody,
            HttpServletResponse response) {
        String code = requestBody.get("authorizationCode");
        String state = requestBody.get("state");

        // Naver로부터 액세스 토큰 받아오기
        String accessToken = oauthService.getNaverAccessToken(code, state);

        // 액세스 토큰을 사용하여 사용자 정보 가져오기
        String userInfoResponse = oauthService.getNaverUserInfo(accessToken);

        // 사용자 이메일 파싱
        String userEmail = oauthService.parseUserEmail(userInfoResponse);

        // 사용자 이메일이 존재하는지 확인
        boolean userExists = userRepository.existsByUserEmail(userEmail);

        if (!userExists) {
            // 유저 이메일이 DB에 존재하지 않는 경우, Naver에서 받은 사용자 정보를 그대로 반환
            return ResponseEntity.ok(userInfoResponse);
        } else {
            // 유저 이메일이 DB에 존재하는 경우, 로그인 처리 후 응답 반환
            // 시큐리티 설정을 위해 이메일, 코드 전달
            ResponseEntity<?> loginResponse = oauthService.oauthLogin(userEmail, accessToken, response);
            return loginResponse;
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> handleGoogleLogin(@RequestBody Map<String, String> requestBody,
            HttpServletResponse response) {

        String code = requestBody.get("authorizationCode");

        // Google로부터 사용자 정보 가져오기
        String userInfoResponse[] = oauthService.getGoogleUserInfo(code);
        String accessToken = userInfoResponse[0];
        String userInfo = userInfoResponse[1];
        // System.out.println("컨트롤러 / userInfoResponse: " + userInfo);
        // System.out.println("컨트롤러 / accessToken: " + accessToken);

        // 사용자 이메일 파싱
        String userEmail = oauthService.parseUserEmail2(userInfo);
        // System.out.println("컨트롤러 / userEmail: " + userEmail);

        // 사용자 이메일이 존재하는지 확인
        boolean userExists = userRepository.existsByUserEmail(userEmail);

        if (!userExists) {
            // 유저 이메일이 DB에 존재하지 않는 경우, Google에서 받은 이메일 그대로 반환
            return ResponseEntity.ok(userEmail);

        } else {
            // 유저 이메일이 DB에 존재하는 경우, 로그인 처리 후 응답 반환
            ResponseEntity<?> loginResponse = oauthService.oauthLogin(userEmail, accessToken, response);
            return loginResponse;
        }
    }

    // 소셜 가입
    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody Map<String, String> user, @RequestParam String code) {
        return oauthService.oauthJoin(user, code);
    }
}
