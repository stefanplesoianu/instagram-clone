package com.yapbook.comments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

import com.yapbook.users.User;
import com.yapbook.posts.Post;

@Repository
public interface CommentRepository extends JpaRepository <Comment, Integer> {

    List<Comment> findByPostId(Integer postId);

    Optional<Comment> findById(Integer commentId);

    void deleteById (Integer commentId);
}
