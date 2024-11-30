package com.yapbook.users;

import java.io.Serializable;
import java.util.Objects;

public class UserFollowingId implements Serializable {
    private Integer user;      // userId of the user being followed
    private Integer follower;  // userId of the follower

    public UserFollowingId() {}

    public UserFollowingId(Integer user, Integer follower) {
        this.user = user;
        this.follower = follower;
    }

    public Integer getUser() {
        return user;
    }

    public void setUser(Integer user) {
        this.user = user;
    }

    public Integer getFollower() {
        return follower;
    }

    public void setFollower(Integer follower) {
        this.follower = follower;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserFollowingId that = (UserFollowingId) o;
        return user.equals(that.user) && follower.equals(that.follower);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, follower);
    }
}
