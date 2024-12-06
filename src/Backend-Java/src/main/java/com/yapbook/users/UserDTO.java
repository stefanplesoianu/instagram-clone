package com.yapbook.users;

import java.util.List;
import java.util.stream.Collectors;

public class UserDTO {
    private Integer id;
    private String imageUrl;
    private String username;
    private String email;
    private String bio;

    private List<Integer> followingIds; 
    private List<Integer> followerIds;

    private List<UserFollowing> followers;
    private List<UserFollowing> following;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<UserFollowing> getFollowing() {
        return following;
    }

    public void setFollowing(List<UserFollowing> following){
        this.following = following;
    }

    public List<UserFollowing> getFollowers() {
        return followers;
    }

    public void setFollowers(List<UserFollowing> followers) {
        this.followers = followers;
    }

    public List<Integer> getFollowingIds() {
        return followingIds;
    }

    public void setFollowingIds(List<Integer> followingIds) {
        this.followingIds = followingIds;
    }

    public List<Integer> getFollowerIds() {
        return followerIds;
    }

    public void setFollowerIds(List<Integer> followerIds) {
        this.followerIds = followerIds;
    }

    public UserDTO() {
    }

    @Override
    public String toString(){
        return "UserDTO{" +
           "id=" + id +
           ", email='" + email + '\'' +
           ", username='" + username + '\'' +
           '}';
    }

}