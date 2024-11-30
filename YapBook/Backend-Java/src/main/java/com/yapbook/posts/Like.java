package com.yapbook.posts;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.yapbook.comments.Comment;
import com.yapbook.users.User;


@Entity
@Table(name = "\"Like\"",uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "postId"}),
    @UniqueConstraint(columnNames = {"userId", "commentId"})
})
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "\"userId\"")
    private User user;

    @ManyToOne
    @JoinColumn(name = "\"postId\"")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "\"commentId\"")
    private Comment comment;

    @Column(name = "\"createdAt\"")
    private LocalDateTime createdAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public Like getLike() {
        return this;
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

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Like(){
    }
}
