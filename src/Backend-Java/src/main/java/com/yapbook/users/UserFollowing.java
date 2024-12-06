package com.yapbook.users;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "\"UserFollowing\"", uniqueConstraints = {@UniqueConstraint(columnNames = {"userId", "followerId"})})
@IdClass(UserFollowingId.class)
public class UserFollowing {

    @Id
    @ManyToOne
    @JoinColumn(name = "\"userId\"", nullable = false)
    private User user; // The user being followed

    @Id
    @ManyToOne
    @JoinColumn(name = "\"followerId\"", nullable = false)
    private User follower; // The user who is following

    public UserFollowing() {}

    // Getters and Setters
    public User getFollower() {
        return follower;
    }

    public void setFollower(User follower) {
        this.follower = follower;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}