package com.yapbook.users;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import com.yapbook.security.JwtTokenUtil;

import java.util.HashMap;
import java.util.UUID;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @GetMapping("/")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader("Authorization") String authToken) {
        try {
            String token = authToken.replace("Bearer ", "");
            Integer userId = jwtTokenUtil.getUserIdFromToken(token); 

            List<UserDTO> users = userService.getAllUsers(userId);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUser(@RequestParam("searchTerm") String searchTerm) {
        try {
            List<UserDTO> users = userService.searchUser(searchTerm);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong, try again");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Integer id) {
        try {
            UserDTO userDTO = userService.getUser(id);
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error, could not get user");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String username = request.get("username");
            String password = request.get("password");
            String confirmPassword = request.get("confirmPassword");

            UserDTO newUserDTO = userService.register(email, username, password, confirmPassword);

            Map<String, Object> map = new HashMap<>();
            map.put("message", "Registered successfully, please log in." );
            map.put("user", newUserDTO);

            return ResponseEntity.ok(map);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error, could not create user");
        }
    }

  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> request) {
          String username = (String) request.get("username");
          String password = (String) request.get("password");

          Map<String, Object> response = userService.login(username, password);

          return ResponseEntity.ok(response);
  }

  @PostMapping("/guest")
  public ResponseEntity<?> guestLogin() {
      try {
          String token = userService.guestLogin();

          return ResponseEntity.ok(Map.of("message", "Guest login successful", "token", token));
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong, try again");
      }
  }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorization) {
        try {
            String token = authorization.substring(7);
            userService.logout(token);
            return ResponseEntity.ok("Logout successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error, error");
        }
    }

    @PostMapping("/edit-photo")
    public ResponseEntity<?> editPhoto(@RequestAttribute("user") User currentUser, @RequestParam("file") MultipartFile file) {
        try {
            UserDTO updatedProfile = userService.editPhoto(currentUser, file);
            return ResponseEntity.ok("Profile updated successfully, New Profile: " + updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong, try again");
        }
    }

    @PostMapping("/delete-photo")
    public ResponseEntity<?> deletePhoto(@RequestAttribute("user") User currentUser) {
        try {
            userService.deletePhoto(currentUser);
            return ResponseEntity.ok("Image deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong, try again");
        }
    }

    @PostMapping("/edit-profile")
    public ResponseEntity<?> editProfile(@RequestAttribute("user") User currentUser, @RequestBody String bio) {
        try {
            var updatedProfile = userService.editProfile(currentUser, bio);
            return ResponseEntity.ok("Profile updated successfully, New Bio: " + updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong, try again");
        }
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable Integer id) {
        try {
            List<UserDTO> followers = userService.getFollowers(id);
            return ResponseEntity.ok(followers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong, try again");
        }
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<?> getFollowing(@PathVariable Integer id) {
        try {
            List<UserDTO> following = userService.getFollowing(id);
            return ResponseEntity.ok(following);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong, try again");
        }
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> follow(@RequestHeader("Authorization") String authToken, @PathVariable Integer id) {
        try {
            String token = authToken.replace("Bearer ", "");
            Integer currentUserId = jwtTokenUtil.getUserIdFromToken(token);

            String result = userService.follow(currentUserId, id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong, try again");
        }
    }
}
