package com.yapbook.posts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ShareRepository extends JpaRepository<Share, Integer> {

    @Query("SELECT s FROM Share s WHERE s.author.id = :userId AND s.post.id = :postId")
    Optional<Share> findShare(@Param("userId") Integer userId, @Param("postId") Integer postId);

}