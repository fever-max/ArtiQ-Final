package com.artiq.back.user.dto;

import java.util.Map;

//업데이트 시 사용되는 dto
public class UserUpdateRequest {
    private String userEmail;
    private Map<String, String> fields;

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Map<String, String> getFields() {
        return fields;
    }

    public void setFields(Map<String, String> fields) {
        this.fields = fields;
    }
}
