package com.artiq.back.config.security;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.artiq.back.user.entity.UserEntity;
import com.artiq.back.user.repository.UserRepository;

@Service
public class SecurityUserDetailService implements UserDetailsService {
    // 사용자의 인증 정보를 데이터베이스에서 조회

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {

        System.out.println("시큐리티 디테일 실행");
        System.out.println("넘어온 userEmail: " + userEmail);

        Optional<UserEntity> optional = userRepository.findByUserEmail(userEmail);

        System.out.println("시큐리티 유저 아이디" + optional.get().getUserEmail());
        System.out.println("시큐리티 유저 아이디 존재여부" + optional.isPresent());

        if (!optional.isPresent()) {
            // 존재하지 않으면
            throw new UsernameNotFoundException(userEmail + " 사용자 없음");
        } else {
            // 존재하면 SecurityUser로 변환하여 전달
            // System.out.println("loadUserByUsername 실행, SecurityUser로 전달 ");
            UserEntity user = optional.get();
            return new SecurityUser(user);
        }

    }

}
