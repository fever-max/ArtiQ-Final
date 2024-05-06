package com.artiq.back.user.dto;

import java.time.LocalDate;

import com.artiq.back.user.entity.UserRole;

import lombok.Getter;
import lombok.Setter;

//유저정보 얻어올 때 사용되는 dto
@Getter
@Setter
public class UserDetailDto {

    private Long userNo;
    private String userEmail;
    private String userRole;
    private String userNickname;
    private String rankLevel;
    private String rankPoint;
    private String socialPlatform;
    private LocalDate userDate;

    // 생성자, getter, setter 등 필요한 메서드들 추가
    public UserDetailDto(Long userNo, String userEmail, String userNickname, UserRole userRole, String rankLevel,
            String rankPoint,
            String socialPlatform, LocalDate userDate) {
        this.userNo = userNo;
        this.userEmail = userEmail;
        this.userRole = userRole.name(); // 열거형 타입을 String으로 변환하여 저장
        this.userNickname = userNickname;
        this.rankLevel = rankLevel;
        this.rankPoint = rankPoint;
        this.socialPlatform = socialPlatform;
        this.userDate = userDate;
    }

    public UserDetailDto() {

    }
}
