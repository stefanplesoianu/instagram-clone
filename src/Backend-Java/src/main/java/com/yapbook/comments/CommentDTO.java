package com.yapbook.comments;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import com.yapbook.users.UserDTO;
import java.time.LocalDateTime;
import com.yapbook.posts.PostDTO;

public class CommentDTO {
    private Integer id;
    private String content;
    private Integer postId;
    private LocalDateTime createdAt;
    private UserDTO author;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id){
        this.id = id;
    }

    public UserDTO getAuthor() {
        return author;
    }

    public void setUser(UserDTO author){
        this.author = author;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime time){
        this.createdAt = time;
    }

    public Integer getPostId(){
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public String getContent(){
        return content;
    }

    public void setContent(String content){
        this.content = content;
    }

    public CommentDTO(){
    }

    public CommentDTO (Integer id, UserDTO author, LocalDateTime createdAt, Integer postId, String content){
        this.id = id;
        this.author = author;
        this.createdAt = createdAt;
        this.postId = postId;
        this.content = content;
    }
}