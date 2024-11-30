package com.yapbook.posts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    Optional<Post> findById(Integer id);
    
    @Query("SELECT p FROM Post p ORDER BY p.createdAt DESC")
    List<Post> findAllPosts();

    @Query("SELECT DISTINCT p FROM Post p " +
       "JOIN Share s ON s.post.id = p.id " +
       "ORDER BY p.createdAt DESC")
    List<Post> findSharedPosts();

    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.comments c LEFT JOIN FETCH p.likes l LEFT JOIN FETCH p.shares s WHERE p.id = :postId")
    Optional<Post> findPostWithDetails(@Param("postId") Integer postId);

}
