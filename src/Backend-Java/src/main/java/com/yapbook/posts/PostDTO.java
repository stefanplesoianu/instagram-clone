package com.yapbook.posts;

import java.util.List;
import java.util.stream.Collectors;
import com.yapbook.users.UserDTO;
import java.time.LocalDateTime;
import java.util.ArrayList;
import com.yapbook.comments.CommentDTO;

public class PostDTO {
    private Integer id;
    private String content;
    private String imageUrl;
    private UserDTO author;
    private Integer authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ShareDTO> shares;
    private List<LikeDTO> likes;
    private List<CommentDTO> comments;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setAuthorId(Integer authorId){
        this.authorId = authorId;
    }

    public Integer getAuthorId(){
        return authorId;
    }

    public String getContent(){
        return content;
    }

    public void setContent(String content){
        this.content = content;
    }

    public String getImageUrl(){
        return imageUrl;
    }

    public void setImageUrl(String imageUrl){
        this.imageUrl = imageUrl;
    }

    public UserDTO getAuthor() {
        return author;
    }

    public void setAuthor(UserDTO author) {
        this.author = author;
    }

    public PostDTO() {
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() { 
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) { 
        this.updatedAt = updatedAt;
    }

    public List<LikeDTO> getLikes() {
        return likes !=null ? likes : new ArrayList<>();
    }

    public void setLikes(List<LikeDTO> likes) {
        this.likes = likes;
    }

    public List<ShareDTO> getShares() {
        return shares !=null ? shares : new ArrayList<>();
    }

    public void setShares(List<ShareDTO> shares){
        this.shares = shares;
    }

    public List<CommentDTO> getComments() {
        return comments !=null ? comments : new ArrayList<>();
    }

    public void setComments(List<CommentDTO> comments){
        this.comments = comments;
    }
}