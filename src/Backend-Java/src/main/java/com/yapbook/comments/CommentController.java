package com.yapbook.comments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.yapbook.comments.CommentService;
import com.yapbook.security.JwtTokenUtil;
import com.yapbook.comments.Comment;

@RestController
@RequestMapping("/posts")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/{postId}/create-comment")
    public ResponseEntity<?> createComment(@RequestBody String content, 
                                           @PathVariable Integer postId, 
                                           @RequestHeader("Authorization") String authToken) {
        try {
            Integer userId = JwtTokenUtil.getUserIdFromToken(authToken);

            if (userId == null || postId == null || content == null || content.trim().isEmpty()) {
                return ResponseEntity.status(400).body("Invalid post ID, user ID, or comment content");
            }

            CommentDTO comment = commentService.createComment(userId, postId, content);

            return ResponseEntity.status(201).body(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Could not post comment, please try again");
        }
    }

    @DeleteMapping("/{postId}/{commentId}/delete-comment")
    public ResponseEntity<?> deleteComment(@PathVariable Integer commentId, 
                                           @RequestHeader("Authorization") String authToken) {
        try {
            Integer userId = JwtTokenUtil.getUserIdFromToken(authToken);

            if (commentId == null || userId == null) {
                return ResponseEntity.status(400).body("Invalid comment ID or user ID");
            }

            String result = commentService.deleteComment(commentId, userId);

            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Server error, please try again");
        }
    }
}
