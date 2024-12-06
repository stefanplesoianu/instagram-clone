package com.yapbook.comments;

import com.yapbook.users.*;
import com.yapbook.posts.*;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    public CommentDTO createComment(Integer userId, Integer postId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid content, cannot create comment");
        }

        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Post post = postRepository.findById(postId)
                                  .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        Comment newComment = new Comment();
        newComment.setUser(user);
        newComment.setPost(post);
        newComment.setContent(content);
        newComment.setCreatedAt(LocalDateTime.now());
        post.addComment(newComment);

        commentRepository.save(newComment);
        postRepository.save(post);
        CommentDTO dto = convertToDTO(newComment);
        return dto;
    }

    public String deleteComment(Integer commentId, Integer userId) {
        Comment comment = commentRepository.findById(commentId)
                                            .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to delete this comment");
        }

        commentRepository.delete(comment);

        Post post = comment.getPost();
        post.deleteComment(comment);

        return "Comment deleted successfully";
    }

    public CommentDTO convertToDTO (Comment comment) {
        Integer id = comment.getId();
        UserDTO author = userService.convertToSimpleDTO(comment.getUser());
        LocalDateTime createdAt = comment.getCreatedAt();
        Integer postId = comment.getPost().getId();
        String content = comment.getContent();

        CommentDTO dto = new CommentDTO(id, author, createdAt, postId, content);
        return dto;
    }
}
