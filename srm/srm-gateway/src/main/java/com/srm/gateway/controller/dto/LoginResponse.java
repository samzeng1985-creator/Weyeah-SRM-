package com.srm.gateway.controller.dto;

public class LoginResponse {
    private String token;
    private Long userId;
    private String username;
    private String realName;

    public LoginResponse() {
    }

    public LoginResponse(String token, Long userId, String username, String realName) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.realName = realName;
    }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public static class LoginResponseBuilder {
        private String token;
        private Long userId;
        private String username;
        private String realName;

        public LoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public LoginResponseBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public LoginResponseBuilder username(String username) {
            this.username = username;
            return this;
        }

        public LoginResponseBuilder realName(String realName) {
            this.realName = realName;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(token, userId, username, realName);
        }
    }
}
