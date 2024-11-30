package com.yapbook.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFollowingRepository extends JpaRepository<UserFollowing, Integer> {
    List<UserFollowing> findByFollowerId(Integer followerId);

    List<UserFollowing> findByUserId(Integer userId);
}
