package com.yapbook.posts;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.lang.RuntimeException;
import java.util.Map;
import java.time.LocalDateTime;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import java.util.HashMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import com.yapbook.users.*;
import com.yapbook.comments.*;

import jakarta.persistence.TypedQuery;
import java.io.IOException;
import java.util.List;

@Service
public class PostService {

    private final Cloudinary cloudinary;

    @Autowired
    public PostService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Autowired
    private UserService userService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ShareRepository shareRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    public Object handleLike(Integer id, Integer userId, boolean isComment, boolean checkOnly) {
        Post post = postRepository.findById(id)
                                  .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Like> existingLike = likeRepository.findLike(userId, id);


        if (checkOnly) {
            return ResponseEntity.ok(post.getLikes());
        } else {
            if(existingLike.isPresent()) {
                post.removePostLike(existingLike.get());
                likeRepository.delete(existingLike.get());

                return ResponseEntity.ok("Unliked successfully");
            }

            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            like.setCreatedAt(LocalDateTime.now());

            likeRepository.save(like);
            return ResponseEntity.ok("Action successful");
        }
    }

    public ResponseEntity<?> handleShare(Integer postId, Integer userId, boolean checkOnly) {
        Post post = postRepository.findById(postId)
                                  .orElseThrow(() -> new RuntimeException("Post not found"));

        if (checkOnly) {
            return ResponseEntity.ok(post.getShares()); 
        } else {
            User user = userRepository.findById(userId)
                                         .orElseThrow(() -> new RuntimeException("User not found"));

            Share share = new Share();
            share.setPost(post);
            share.setUser(user);
            share.setCreatedAt(LocalDateTime.now());
            shareRepository.save(share);

            post.incrementShareCount(share);
            postRepository.save(post);
            return ResponseEntity.status(HttpStatus.CREATED).body("Share count incremented");
        }
    }
    
    public Object getGuestPosts(){
        List<Post> posts = postRepository.findAllPosts();
        List<PostDTO> dto = posts.stream().map(p -> convertToDTO(p))
                            .collect(Collectors.toList());

        List<Post> sharedPosts = postRepository.findSharedPosts();
        List<PostDTO> sharedPostsDTO = posts.stream().map(p -> convertToDTO(p))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", dto);
        response.put("sharedPosts", sharedPostsDTO);
        return response;
    }

    public Object getUserPosts(List<Integer> excludedIds) {
        List<Post> posts = postRepository.findAllPosts();
        List<PostDTO> postsDTO = posts.stream().map(p -> convertToDTO(p))
                        .collect(Collectors.toList());

        List<Post> sharedPosts = postRepository.findSharedPosts();
        List<PostDTO> sharedPostsDTO = posts.stream().map(p -> convertToDTO(p))
                .collect(Collectors.toList());

        Pageable limit = PageRequest.of(0,7);
        List<User> userSuggestions = userRepository.findUserSuggestions(excludedIds, limit);
        List<UserDTO> usersDTO = userSuggestions.stream().map(u -> userService.convertToSimpleDTO(u))
                                        .collect(Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("posts", postsDTO);
        response.put("sharedPosts", sharedPostsDTO);
        response.put("users", usersDTO);
        return response;
    }

    public PostDTO createPost(String content, MultipartFile file, Integer userId) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
            ObjectUtils.asMap(
                "folder", "YapBookPosts",
                "allowed_formats", new String[]{"jpeg", "png", "jpg", "gif", "webp"}
            )
            );
            String imageUrl = (String) uploadResult.get("secure_url");

            User foundUser = userRepository.findById(userId)
                                    .orElseThrow(() -> new RuntimeException("User not found"));

            Post post= new Post();
            post.setContent(content);
            post.setImageUrl(imageUrl);
            post.setAuthorId(userId);
            post.setAuthor(foundUser);
            post.setCreatedAt(LocalDateTime.now());
            post.setUpdatedAt(LocalDateTime.now());
            postRepository.save(post);

            return convertToDTO(post);
        } catch (IOException e) {
            throw new RuntimeException("Error uploading file to Cloudinary", e);
        }
    }

    public PostDTO editPost(Integer id, String content) {
        Post post = postRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setContent(content);
        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);

        PostDTO dto = convertToDTO(post);
        return dto;
    }

    public String deletePost(Integer postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            postRepository.deleteById(postId);
            return "Post deleted successfully";
        } else {
            return "Post not found";
        }
    }    

    public Map<String, Object> getPostById(Integer postId){
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

        PostDTO dto = convertToDTO(post);
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("post", dto);
        return response;
    }

    public ShareDTO convertToShareDTO(Share share){
        Integer id = share.getId();
        Integer userId = share.getUser().getId();
        LocalDateTime createdAt = share.getCreatedAt();
        Integer postId = share.getPost().getId();

        ShareDTO dto = new ShareDTO(id, userId, createdAt, postId);
        return dto;
    }

    public LikeDTO convertToLikeDTO(Like like){
        Integer id = like.getId();
        Integer userId = like.getUser().getId();
        LocalDateTime createdAt = like.getCreatedAt();
        Integer postId = like.getPost().getId();

        LikeDTO dto = new LikeDTO(id, userId, createdAt, postId);
        return dto;
    }

        public CommentDTO convertToCommentDTO (Comment comment) {
        Integer id = comment.getId();
        UserDTO author = userService.convertToSimpleDTO(comment.getUser());
        LocalDateTime createdAt = comment.getCreatedAt();
        Integer postId = comment.getPost().getId();
        String content = comment.getContent();

        CommentDTO dto = new CommentDTO(id, author, createdAt, postId, content);
        return dto;
    }

    public PostDTO convertToDTO(Post post) {
        UserDTO user = userService.convertToSimpleDTO(post.getAuthor());

        PostDTO dto = new PostDTO();
        dto.setAuthorId(post.getAuthorId());
        dto.setAuthor(userService.convertToSimpleDTO(post.getAuthor()));
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setShares(post.getShares().stream()
                      .map(share -> convertToShareDTO(share)) 
                      .collect(Collectors.toList()));
        dto.setComments(post.getComments().stream()
                        .map(comment -> convertToCommentDTO(comment))
                        .collect(Collectors.toList()));
        dto.setLikes(post.getLikes().stream()
                     .map(like -> convertToLikeDTO(like))
                     .collect(Collectors.toList()));

        return dto;
    }
}

