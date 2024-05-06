package com.artiq.back.config.security;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;

import com.artiq.back.user.entity.UserEntity;

public class SecurityUser extends User {

    private UserEntity user;

    public SecurityUser(UserEntity user) {
        super(user.getUserNo().toString(), user.getUserPw(),
                AuthorityUtils.createAuthorityList(user.getUserRole().toString()));
        this.user = user;

        // System.out.println("SecurityUser 실행");
        // System.out.println("user.getUserRole():" + user.getUserRole());
    }

    public UserEntity getMember() {
        return user;
    }
}
