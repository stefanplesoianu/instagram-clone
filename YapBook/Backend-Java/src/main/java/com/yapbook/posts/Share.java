package com.yapbook.posts;

import jakarta.persistence.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import com.yapbook.users.User;

@Entity
@Table(name = "\"Share\"")
public class Share {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "\"postId\"")
    private Post post;

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "\"userId\"", insertable = false, updatable = false)
    private User author;

    public Share() {
    }

    public Share(Post post, User user, LocalDateTime createdAt) {
        this.post = post;
        this.author = user;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return author;
    }

    public void setUser(User user) {
        this.author = user;
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