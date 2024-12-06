package com.yapbook.posts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {

    @Query("SELECT l FROM Like l WHERE l.user.id = :userId AND l.post.id = :entityId")
    Optional<Like> findLike(@Param("userId") Integer userId, @Param("entityId") Integer entityId);

}
