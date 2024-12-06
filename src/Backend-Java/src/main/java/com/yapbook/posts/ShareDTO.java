package com.yapbook.posts;

import jakarta.persistence.*;
import java.time.LocalDateTime;

public class ShareDTO {
    private Integer id;
    private Integer userId; 
    private Integer postId;
    private LocalDateTime createdAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id){
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId){
        this.userId = userId;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId){
        this.postId = postId;
    }

    public void setCreatedAt(LocalDateTime createdAt){
        this.createdAt = createdAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public ShareDTO(Integer id, Integer userId, LocalDateTime createdAt, Integer postId){
        this.id = id;
        this.userId = userId;
        this.createdAt = createdAt;
        this.postId = postId;
    }

    public ShareDTO(){
    }

}