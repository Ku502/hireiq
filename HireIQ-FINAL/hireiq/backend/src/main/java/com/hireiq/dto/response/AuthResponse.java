package com.hireiq.dto.response;

public class AuthResponse {

    private UserResponse user;
    private String accessToken;
    private String refreshToken;

    public AuthResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AuthResponse o = new AuthResponse();
        public Builder user(UserResponse v)      { o.user = v; return this; }
        public Builder accessToken(String v)     { o.accessToken = v; return this; }
        public Builder refreshToken(String v)    { o.refreshToken = v; return this; }
        public AuthResponse build()              { return o; }
    }

    public UserResponse getUser()        { return user; }
    public String getAccessToken()       { return accessToken; }
    public String getRefreshToken()      { return refreshToken; }

    public void setUser(UserResponse v)      { this.user = v; }
    public void setAccessToken(String v)     { this.accessToken = v; }
    public void setRefreshToken(String v)    { this.refreshToken = v; }
}
