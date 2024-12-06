package com.yapbook.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"BlacklistToken\"")
@Getter
@Setter
@NoArgsConstructor
public class BlacklistToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false, name = "\"createdAt\"")
    private LocalDateTime createdAt;

    @Column(nullable = false, name = "\"expiryDate\"")
    private LocalDateTime expiryDate;

    @Column(nullable = true, name = "\"userId\"")
    private Integer userId;

    @Column(nullable = true, name = "\"guestId\"")
    private String guestId;

    private LocalDateTime calculateExpiryDate() {
        return LocalDateTime.now().plusDays(20);
    }

    public void setToken(String token){
        this.token = token;
    }

    public String getToken(){
        return token;
    }

    public void setExpiryDate(LocalDateTime date){
        this.expiryDate = date;
    }

    public LocalDateTime getExpiryDate(){
        return expiryDate;
    }

    public void setUserId(Integer userId){
        this.userId = userId;
    }

    public Integer getUserId(){
        return userId;
    }

    public void setGuestId(String guestId){
        this.guestId = guestId;
    }

    public String getGuestId(){
        return guestId;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime x){
        this.createdAt = x;
    }
}
