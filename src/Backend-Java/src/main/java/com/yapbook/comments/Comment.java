package com.yapbook.comments;

import jakarta.persistence.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import com.yapbook.users.User; 
import com.yapbook.posts.Post; 

@Entity
@Table(name = "\"Comment\"")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "\"userId\"")
    private User user;

    @ManyToOne
    @JoinColumn(name = "\"postId\"")
    private Post post;

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt;

    public Comment(Integer id) {
        this.id = id;
    }

    public Comment(String content, User user, Post post) {
        this.content = content;
        this.user = user;
        this.post = post;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Comment() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
