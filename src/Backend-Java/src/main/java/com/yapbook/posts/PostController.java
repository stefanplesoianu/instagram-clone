package com.yapbook.posts;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import java.lang.Integer;
import java.util.Map;
import java.util.HashMap;
import org.springframework.http.MediaType;
import java.util.List;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Integer postId, @RequestParam boolean isComment,
                                      @RequestHeader("Authorization") String authToken, HttpServletRequest request) {
        try {
            Integer userId = (Integer) request.getAttribute("userId");
            return ResponseEntity.status(HttpStatus.OK).body(postService.handleLike(postId, userId, isComment, false));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while liking the post.");
        }
    }

    @GetMapping("/{id}/like")
    public ResponseEntity<?> checkLike(@PathVariable Integer id, @RequestParam boolean isComment,
                                       @RequestHeader("Authorization") String authToken, HttpServletRequest request) {
        try {
            Integer userId = (Integer) request.getAttribute("userId");
            return ResponseEntity.status(HttpStatus.OK).body(postService.handleLike(id, userId, isComment, true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while checking like status.");
        }
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<?> sharePost(@PathVariable Integer id, @RequestHeader("Authorization") String authToken, HttpServletRequest request) {
        try {
            Integer userId = (Integer) request.getAttribute("userId");
            return postService.handleShare(id, userId, false);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while sharing the post.");
        }
    }      

    @GetMapping("/{id}/share")
    public ResponseEntity<?> checkShare(@PathVariable Integer id, @RequestHeader("Authorization") String authToken, HttpServletRequest request) {
        try {
            Integer userId = (Integer) request.getAttribute("userId");
            return postService.handleShare(id, userId, true);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while checking share status.");
        }
    }
    
    @PostMapping("/guestPosts")
    public ResponseEntity<?> getGuestPosts() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(postService.getGuestPosts());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while fetching posts.");
        }
    }

    @PostMapping
    public ResponseEntity<?> getUserPosts(@RequestBody Map<String, List<Integer>> request) {
        try {
            List<Integer> excludedIds = request.get("followerIds");
            return ResponseEntity.status(HttpStatus.OK).body(postService.getUserPosts(excludedIds));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while fetching user posts.");
        }
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
        @RequestParam("content") String content,
        @RequestParam("file") MultipartFile file,
        HttpServletRequest request) {

        try {
            if(file.isEmpty()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File needed to create post");
            }
                Integer userId = (Integer) request.getAttribute("userId");
                PostDTO postDTO = postService.createPost(content, file, userId);
                return ResponseEntity.status(HttpStatus.CREATED).body(postDTO);
        } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while creating post.");
        }
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<?> editPost(@PathVariable Integer id, @RequestBody String newContent) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(postService.editPost(id, newContent));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while editing post.");
        }
    }

    @GetMapping("/viewPost/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable Integer postId) {
        try {
            Map<String, Object> response = postService.getPostById(postId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 404);
            errorResponse.put("message", "Post not found with id: " + postId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> deletePost(@PathVariable Integer id) {
        try {
            String result = postService.deletePost(id);
            
            if ("Post deleted successfully".equals(result)) {
                return ResponseEntity.status(HttpStatus.OK).body(result);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while deleting post.");
        }
    }    
 
}
