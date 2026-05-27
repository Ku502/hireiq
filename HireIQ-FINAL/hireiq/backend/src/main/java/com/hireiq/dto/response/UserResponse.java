package com.hireiq.dto.response;
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String username;
    private String avatarUrl;
    private String plan;
    private String targetRole;
    private String experienceLevel;
    public UserResponse() {}
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final UserResponse o = new UserResponse();
        public Builder id(Long v)               { o.id = v; return this; }
        public Builder email(String v)          { o.email = v; return this; }
        public Builder fullName(String v)       { o.fullName = v; return this; }
        public Builder username(String v)       { o.username = v; return this; }
        public Builder avatarUrl(String v)      { o.avatarUrl = v; return this; }
        public Builder plan(String v)           { o.plan = v; return this; }
        public Builder targetRole(String v)     { o.targetRole = v; return this; }
        public Builder experienceLevel(String v){ o.experienceLevel = v; return this; }
        public UserResponse build()             { return o; }
    }
    public Long getId()                { return id; }
    public String getEmail()           { return email; }
    public String getFullName()        { return fullName; }
    public String getUsername()        { return username; }
    public String getAvatarUrl()       { return avatarUrl; }
    public String getPlan()            { return plan; }
    public String getTargetRole()      { return targetRole; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setId(Long v)               { this.id = v; }
    public void setEmail(String v)          { this.email = v; }
    public void setFullName(String v)       { this.fullName = v; }
    public void setUsername(String v)       { this.username = v; }
    public void setAvatarUrl(String v)      { this.avatarUrl = v; }
    public void setPlan(String v)           { this.plan = v; }
    public void setTargetRole(String v)     { this.targetRole = v; }
    public void setExperienceLevel(String v){ this.experienceLevel = v; }
}
