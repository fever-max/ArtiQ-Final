package com.artiq.back.config.oauth2;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.artiq.back.config.security.JwtTokenProvider;
import com.artiq.back.config.security.SecurityUserDetailService;
import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.entity.UserPointEntity;
import com.artiq.back.user.entity.UserRankEntity;
import com.artiq.back.user.entity.UserRole;

import com.artiq.back.user.entity.UserSocialEntity;
import com.artiq.back.user.repository.UserPointRepository;
import com.artiq.back.user.repository.UserRankRepository;
import com.artiq.back.user.repository.UserRepository;
import com.artiq.back.user.repository.UserSocialRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OAuthService {

    private final UserRepository userRepository;
    private final UserSocialRepository userSocialRepository;
    private final UserRankRepository userRankRepository;
    private final UserPointRepository userPointRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RestTemplate restTemplate;
    private final SecurityUserDetailService userDetailService;

    @Value("${spring.security.oauth2.client.provider.naver.token-uri}")
    private String naverTokenEndpoint;
    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String naverClientId;
    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String naverClientSecret;
    @Value("${spring.security.oauth2.client.provider.naver.user-info-uri}")
    private String naverUserInfoEndpoint;

    @Value("${oauth2.google.client-id}")
    private String googleClientId;
    @Value("${oauth2.google.client-secret}")
    private String googleClientSecret;
    @Value("${oauth2.google.redirect-uri}")
    private String googleRedirectUri;
    @Value("${oauth2.google.access-token-uri}")
    private String googleTokenEndpoint;

    // Google API 사용자 정보
    public String[] getGoogleUserInfo(String code) {
        System.out.println("getGoogleUserInfo 실행");
        // Google API 요청을 위한 엔드포인트 URL
        String accessToken = getGoogleAccessToken(code);
        String endpoint = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;
        // Google API에 GET 요청을 보내 사용자 정보를 가져오기
        System.out.println("endpoint 받아옴");
        String userInfoResponse = restTemplate.getForObject(endpoint, String.class);
        // 엑세스 토큰과 사용자 정보 응답을 배열로 묶어 반환
        return new String[] { accessToken, userInfoResponse };
    }

    // 인증 코드 사용하여 액세스 토큰을 요청하는 메소드
    public String getGoogleAccessToken(String code) {

        System.out.println("getGoogleAccessToken 실행");

        // POST 요청에 필요한 파라미터 설정
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("code", code);
        requestBody.add("client_id", googleClientId);
        requestBody.add("client_secret", googleClientSecret);
        requestBody.add("redirect_uri", googleRedirectUri);
        requestBody.add("grant_type", "authorization_code");

        System.out.println("POST 요청에 필요한 파라미터 설정");

        // POST 요청 보내기
        ResponseEntity<Map> response = restTemplate.postForEntity(googleTokenEndpoint, requestBody, Map.class);

        System.out.println("getAccessToken response: " + response);

        // 요청 결과 확인
        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, String> responseBody = response.getBody();
            return responseBody.get("access_token");
        } else {
            // 요청 실패 처리
            throw new RuntimeException("Failed to get access token from Google API");
        }
    }

    // 네이버 API 토큰
    public String getNaverAccessToken(String authorizationCode, String state) {
        String accessToken = null;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");
        String requestBody = "grant_type=authorization_code&client_id=" + naverClientId + "&client_secret="
                + naverClientSecret + "&code=" + authorizationCode + "&state=" + state;
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = new RestTemplate().exchange(naverTokenEndpoint, HttpMethod.POST, request,
                String.class);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            accessToken = jsonNode.get("access_token").asText();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return accessToken;
    }

    // 네이버 API 유저 정보
    public String getNaverUserInfo(String accessToken) {
        String userInfoResponse = null;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = new RestTemplate().exchange(naverUserInfoEndpoint, HttpMethod.GET, request,
                String.class);
        userInfoResponse = response.getBody();

        return userInfoResponse;
    }

    // 네이버 이메일 파싱
    public String parseUserEmail(String userInfoResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(userInfoResponse);
            JsonNode responseNode = jsonNode.get("response");
            if (responseNode != null) {
                String userEmail = responseNode.get("email").asText();
                return userEmail;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // 구글 이메일 파싱
    public String parseUserEmail2(String userInfoResponse) {
        try {
            // ObjectMapper를 사용하여 JSON 문자열을 JsonNode로 파싱
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(userInfoResponse);

            // "email" 필드의 값을 추출하여 반환
            String userEmail = jsonNode.get("email").asText();
            return userEmail;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 소셜 아이디 회원가입
    public ResponseEntity<String> oauthJoin(Map<String, String> user, String code) {
        String userEmail = user.get("userEmail");
        Optional<UserEntity> existingUser = userRepository.findByUserEmail(userEmail);

        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 가입된 이메일입니다.");
        }

        // 유저 테이블 저장
        UserEntity newUser = UserEntity.builder()
                .userEmail(userEmail)
                .userPw(passwordEncoder.encode(user.get("userPw")))
                .userNickname(user.get("userNickname"))
                .userTel(user.get("userTel"))
                .userRole(UserRole.ROLE_USER)
                .userDate(LocalDate.now())
                .build();
        userRepository.save(newUser);

        // 소셜 테이블 저장
        UserSocialEntity newSocial = UserSocialEntity.builder()
                .userEmail(userEmail)
                .socialPlatform(code)
                .build();
        userSocialRepository.save(newSocial);

        // 멤버쉽 테이블 저장
        UserRankEntity rankUser = UserRankEntity.builder()
                .userEmail(userEmail)
                .rankLevel("1")
                .rankPoint("3000")
                .build();
        userRankRepository.save(rankUser);

        // 포인트 결제 테이블 추가
        UserPointEntity userPoint = UserPointEntity.builder()
                .pointRole("충전")
                .pointCertify("")
                .userEmail(userEmail)
                .pointCharge("3000")
                .pointPay("")
                .pointComment("회원가입 환영 포인트")
                .pointDate(LocalDateTime.now())
                .build();
        userPointRepository.save(userPoint);

        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    // 소셜 로그인
    public ResponseEntity<Void> oauthLogin(String email, String accessToken, HttpServletResponse response) {

        // 시큐리티
        // 사용자 인증 정보 생성
        UserDetails userDetails = userDetailService.loadUserByUsername(email);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, accessToken,
                userDetails.getAuthorities());

        // 인증 정보를 SecurityContextHolder에 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 이메일 db체크
        UserEntity userEntity = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        // JWT 토큰 생성
        String jwtToken = jwtTokenProvider.createToken(userEntity.getUserEmail(), userEntity.getUserNickname(),
                userEntity.getUserRole());

        System.out.println("jwtToken: " + jwtToken);

        // 쿠키 생성 및 설정
        Cookie cookie = new Cookie("jwtToken", jwtToken);
        cookie.setDomain("localhost");
        cookie.setPath("/"); // 쿠키 경로 설정
        cookie.setMaxAge(30 * 60); // 유효 시간 설정 (30분)
        cookie.setSecure(true); // Secure 속성 설정 (HTTPS 필요)
        cookie.setHttpOnly(true); // http에서 수정 불가 (JavaScript를 통해 쿠키에 접근 불가)
        response.addCookie(cookie); // 응답에 쿠키 추가

        // 응답에 상태코드만 반환 (리액트에서는 상태코드를 확인하여 처리)
        return ResponseEntity.noContent().build();
    }
}