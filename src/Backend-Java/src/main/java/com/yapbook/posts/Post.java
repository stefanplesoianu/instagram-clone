package com.yapbook.posts;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import com.yapbook.users.User;
import com.yapbook.comments.Comment;

@Entity
@Table(name = "\"Post\"")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String content;

    @Column(name = "\"imageUrl\"")
    private String imageUrl;

    @Column(name = "\"authorId\"", insertable = false, updatable = false)
    private Integer authorId;

    @ManyToOne
    @JoinColumn(name = "\"authorId\"")
    private User author;

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt;

    @Column(name = "\"updatedAt\"")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Share> shares;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    public Integer getId() {
        return id;
    }

public User getAuthor() {
    return author;
}

public void setAuthor(User author) {
    this.author = author;
}


    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime date){
        this.createdAt = date;
    }

    public void setAuthorId(Integer authorId){
        this.authorId = authorId;
    }

    public Integer getAuthorId(){
        return authorId;
    }

    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime date){
        this.updatedAt = date;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Post(Integer id) {
        this.id = id;
        this.likes = new ArrayList<>();
        this.shares = new ArrayList<>();
        this.comments = new ArrayList<>();
    }

    public Post() {
        this.likes = new ArrayList<>();
        this.shares = new ArrayList<>();
        this.comments = new ArrayList<>();
    }

    public void setImageUrl(String imageUrl){
        this.imageUrl = imageUrl;
    }

    public String getImageUrl(){
        return imageUrl;
    }

    public void setLikes(List<Like> likes){
        this.likes = likes;
    }

    public List<Like> getLikes() {
        return likes !=null ? likes : new ArrayList<>();
    }

    public void addPostLike(Like like) {
        this.likes.add(like);
    }

    public void removePostLike(Like like){
        this.likes.remove(like);
    }

    public List<Share> getShares() {
        return shares !=null ? shares : new ArrayList<>();
    }

    public void setShares(List<Share> shares){
        this.shares = shares;
    }

    public void incrementShareCount(Share share) {
        this.shares.add(share);
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContent(){
        return content;
    }

    public List<Comment> getComments(){
        return comments !=null ? comments : new ArrayList<>();
    }

    public void setComments(List<Comment> comments){
        this.comments = comments;
    }

    public void deleteComment(Comment comment){
        this.comments.remove(comment);
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }
}
