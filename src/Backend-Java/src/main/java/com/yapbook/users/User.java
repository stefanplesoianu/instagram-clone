package com.yapbook.users;

import jakarta.persistence.*;
import java.util.List;
import java.io.Serializable;
import java.util.stream.Collectors;
import com.yapbook.posts.Post;
import com.yapbook.posts.Like;
import com.yapbook.posts.Share;
import com.yapbook.comments.Comment;

@Entity
@Table(name = "\"User\"")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String username;

    @Column
    private String bio;

    @Column(name = "\"imageUrl\"")
    private String imageUrl;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Share> shares;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserFollowing> following;

    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL)
    private List<UserFollowing> followers;

    public User() {
    }

    @Override
    public String toString() {
        return "User{id=" + id + ", username='" + username + "'}";
    }

    public List<UserFollowing> getFollowing() {
        return following;
    }

    public List<User> getFollowingUser() {
        return following.stream()
                        .map(UserFollowing::getUser)
                        .collect(Collectors.toList());
    }  
    
    public void setFollowing(List<UserFollowing> following) {
        this.following = following;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<Integer> getFollowingIds() {
        return following.stream()
                .map(f -> f.getUser().getId()) 
                .collect(Collectors.toList());
    }

    public List<Integer> getFollowerIds() {
        return followers.stream()
                .map(f -> f.getUser().getId()) 
                .collect(Collectors.toList());
    }

    public List<User> getFollowersUser() {
        return followers.stream()
                        .map(UserFollowing::getFollower)
                        .collect(Collectors.toList());
    }    

    public List<UserFollowing> getFollowers() {
        return followers;
    }

    public User(Integer id) {
        this.id = id;
    }

    public User(String email, String username, String password) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.imageUrl = null;
        this.bio = null;
    }

    public User(String email, String username, String password, String bio, String imageUrl) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.bio = bio; 
        this.imageUrl = imageUrl;
    }
}