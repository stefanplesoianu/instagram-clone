package com.yapbook.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.yapbook.security.JwtTokenUtil;
import com.yapbook.security.BlacklistToken;
import com.yapbook.security.BlacklistTokenRepository;
import java.util.List;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;


@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private BlacklistTokenRepository blacklistTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserFollowingRepository userFollowingRepository;

    public UserDTO register(String email, String username, String password, String confirmPassword) {
        if(!password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        String hashedPassword = passwordEncoder.encode(password);
        User newUser = new User(email, username, hashedPassword);
        userRepository.save(newUser);
        return convertToSimpleDTO(newUser);
    }

    public Map<String, Object> login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        User foundUser = user.orElseThrow(() -> new RuntimeException("User not found"));
        Boolean isMatch = passwordEncoder.matches(password, foundUser.getPassword());

        if(!isMatch) {
            throw new RuntimeException("Invalied username or password");
        }
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", foundUser.getId());
        userMap.put("username", foundUser.getUsername());

        Map<String, Object> map = new HashMap<>();

        map.put("user", userMap);
        map.put("token", jwtTokenUtil.generateToken(username, foundUser.getId(), null));
        return map;
    }   

    public String guestLogin() {
        String guestId = UUID.randomUUID().toString();

        return jwtTokenUtil.generateToken(null, null, guestId);
    }

    public void logout(String token) {
        String jti = jwtTokenUtil.getJtiFromToken(token);
        Integer userId = jwtTokenUtil.getUserIdFromToken(token); 
        String guestId = jwtTokenUtil.getGuestIdFromToken(token);

        BlacklistToken blacklisted = new BlacklistToken();
        blacklisted.setToken(token); 
        blacklisted.setCreatedAt(LocalDateTime.now());   
        blacklisted.setExpiryDate(calculateExpiryDate(token)); 
        blacklisted.setUserId(userId);                     
        blacklisted.setGuestId(guestId);                         

        blacklistTokenRepository.save(blacklisted);
    }

    private LocalDateTime calculateExpiryDate(String token) {
        Date expirationDate = jwtTokenUtil.getExpirationDateFromToken(token);
        return expirationDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    public void deletePhoto(User user) {
        user.setImageUrl(null);
        userRepository.save(user);
    }

    public UserDTO editPhoto(User currentUser, MultipartFile file) {
        String newImageUrl = file.getOriginalFilename(); 
        currentUser.setImageUrl(newImageUrl);
        userRepository.save(currentUser);
        return convertToDTO(currentUser);
    }
    

    public User editProfile(User user, String newBio) {
        user.setBio(newBio);
        return userRepository.save(user);
    }

public List<UserDTO> getFollowers(Integer userId) {
    List<UserFollowing> followship = userFollowingRepository.findByUserId(userId);
    return followship.stream()
                     .map(UserFollowing::getFollower)
                     .map(this::convertToSimpleDTO)
                     .collect(Collectors.toList());
}

    public List<UserDTO> getFollowing(Integer userId) {
        List<UserFollowing> followship = userFollowingRepository.findByFollowerId(userId);
        return followship.stream()
                     .map(UserFollowing::getUser)
                     .map(this::convertToSimpleDTO)
                     .collect(Collectors.toList());
    }

    @Transactional
    public String follow(Integer userId, Integer targetUserId) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new RuntimeException("User not found"));
        User targetUser = userRepository.findById(targetUserId)
                                        .orElseThrow(() -> new RuntimeException("Target user not found"));

        Optional<UserFollowing> existingFollow = targetUser.getFollowing().stream()
                                                    .filter(f -> f.getFollower().getId().equals(userId))
                                                    .findFirst();
    
        if (existingFollow.isPresent()) {
            UserFollowing follow = existingFollow.get();
            userFollowingRepository.delete(follow);

            targetUser.getFollowers().remove(follow);
            user.getFollowing().remove(follow);

            userRepository.save(targetUser);
            userRepository.save(user);
    
            return "Unfollowed successfully";
        } else {

            UserFollowing userFollowing = new UserFollowing();
            userFollowing.setUser(targetUser);
            userFollowing.setFollower(user);
            userFollowingRepository.save(userFollowing);

            targetUser.getFollowers().add(userFollowing);
            user.getFollowing().add(userFollowing);

            userRepository.save(targetUser);
            userRepository.save(user);
    
            return "Followed successfully";
        }
    }    

    public List<UserDTO> getAllUsers(Integer currentUserId) {
        List<User> users = userRepository.findAll();
        return users.stream()
                    .filter(user -> !user.getId().equals(currentUserId))
                    .map(this::convertToDTO)
                    .toList();
    }

    public List<UserDTO> searchUser(String searchTerm) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(searchTerm);
        return users.stream()
                    .map(this::convertToDTO)
                    .toList();
    }

    public UserDTO getUser(Integer userId) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    public UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setBio(user.getBio());
        dto.setImageUrl(user.getImageUrl());
        dto.setFollowingIds(user.getFollowingIds());
        dto.setFollowerIds(user.getFollowerIds());

        dto.setFollowers(user.getFollowers());

        dto.setFollowing(user.getFollowing());

        return dto;
    }

    // converting a follower to DTO excluding his own followers/follows to prevent recursion

    public UserDTO convertToSimpleDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setBio(user.getBio());
        dto.setImageUrl(user.getImageUrl());
        return dto;
    }
}
