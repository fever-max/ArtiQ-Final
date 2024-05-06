package com.artiq.back.user.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.artiq.back.config.email.MailSendService;
import com.artiq.back.config.security.JwtTokenProvider;
import com.artiq.back.config.security.SecurityUserDetailService;
import com.artiq.back.user.entity.*;
import com.artiq.back.user.repository.UserPointRepository;
import com.artiq.back.user.repository.UserRankRepository;
import com.artiq.back.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserRankRepository userRankRepository;
    private final UserPointRepository userPointRepository;

    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUserDetailService userDetailService;

    private final MailSendService mailSendService;

    public ResponseEntity<String> join(UserEntity user) {
        String userEmail = user.getUserEmail();
        Optional<UserEntity> existingUser = userRepository.findByUserEmail(userEmail);

        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 가입된 이메일입니다.");
        }

        UserEntity newUser = UserEntity.builder()
                .userEmail(userEmail)
                .userPw(passwordEncoder.encode(user.getUserPw()))
                .userNickname(user.getUserNickname())
                .userTel(user.getUserTel())
                .userRole(UserRole.ROLE_USER)
                .userDate(LocalDate.now())
                .build();
        userRepository.save(newUser);

        // 멤버쉽 테이블 추가
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

    public boolean checkEmail(String email) {
        return userRepository.existsByUserEmail(email);
    }

    public boolean checkTel(String tel) {
        return userRepository.existsByUserTel(tel);
    }

    public ResponseEntity<String> login(UserEntity user, HttpServletResponse response) {

        System.out.println("로그인 서비스 실행");

        // 사용자 인증 정보 생성
        UserDetails userDetails = userDetailService.loadUserByUsername(user.getUserEmail());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, user.getUserPw(),
                userDetails.getAuthorities());

        // System.out.println("userDetails:" + userDetails);
        // System.out.println("authentication:" + authentication);

        // 인증 정보를 SecurityContextHolder에 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 인증이 완료 후 DB 이메일 비번 검사
        UserEntity userEntity = userRepository.findByUserEmail(user.getUserEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        String userEmail = userEntity.getUserEmail();

        if (userEmail.equals("admin")) {
            // 어드민 계정인 경우에는 비밀번호를 해싱하지 않고 비교
            if (!user.getUserPw().equals(userEntity.getUserPw())) {
                throw new IllegalArgumentException("어드민 계정 비밀번호가 맞지 않습니다.");
            }
        } else {
            // 일반 사용자인 경우에는 비밀번호를 해싱하여 비교
            if (!passwordEncoder.matches(user.getUserPw(), userEntity.getUserPw())) {
                throw new IllegalArgumentException("이메일 또는 비밀번호가 맞지 않습니다.");
            }
        }

        // jwt 토큰 생성 (인가)
        String jwtToken = jwtTokenProvider.createToken(userEntity.getUserEmail(), userEntity.getUserNickname(),
                userEntity.getUserRole());

        // 시큐리티에 전달 (시큐리티 필터로 넘김)
        // Authentication auth = jwtTokenProvider.getAuthentication(jwtToken);
        // SecurityContextHolder.getContext().setAuthentication(auth);

        // 쿠키 생성 및 설정
        Cookie cookie = new Cookie("jwtToken", jwtToken);
        cookie.setDomain("localhost");
        cookie.setPath("/"); // 쿠키 경로 설정
        cookie.setMaxAge(30 * 60); // 유효 시간 설정 (30분)
        cookie.setSecure(true); // Secure 속성 설정 (HTTPS 필요)
        cookie.setHttpOnly(true); // http에서 수정 불가 (JavaScript를 통해 쿠키에 접근 불가)
        response.addCookie(cookie); // 응답에 쿠키 추가

        // 로그인 후 Authentication 객체를 가져옴
        Authentication test = SecurityContextHolder.getContext().getAuthentication();
        if (test != null && test.isAuthenticated()) {
            // 사용자의 권한 정보 확인
            System.out.println("사용자의 권한: " + test.getAuthorities());
        }

        // 응답에 상태코드 반환 (리액트에서는 상태코드를 확인하여 처리)
        return ResponseEntity.ok(jwtToken);
    }

    // 유저 전화번호 조회
    public ResponseEntity<String> findEmailByUserTel(UserEntity user) {
        Optional<UserEntity> userOptional = userRepository.findByUserTel(user.getUserTel());

        if (userOptional.isPresent()) {
            String userEmail = userOptional.get().getUserEmail();
            return ResponseEntity.ok(userEmail);
        } else {
            // 유저가 존재하지않으면 404에러
            return ResponseEntity.notFound().build();
        }
    }

    // 유저 비밀번호 찾기
    public ResponseEntity<String> findPwdByUser(UserEntity user) {
        Optional<UserEntity> userOptional = userRepository.findByUserEmail(user.getUserEmail());

        if (userOptional.isPresent()) {
            UserEntity userEntity = userOptional.get();
            String dbUserTel = userEntity.getUserTel();
            String inputTel = user.getUserTel();

            if (dbUserTel.equals(inputTel)) {
                // CompletableFuture를 사용하여 비동기적으로 메일 전송
                // 이렇게 안하면 메일 전송하고 완료된 후에 넘어가는데 3초정도 딜레이 발생함
                CompletableFuture.runAsync(() -> {
                    try {
                        mailSendService.sendEmailForCertification(user.getUserEmail());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });

                // 메일 전송이 완료되기를 기다리지 않고 즉시 응답을 보냄
                return ResponseEntity.ok("메일 전송함");
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
