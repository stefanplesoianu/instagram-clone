package com.yapbook.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Optional<User> findById(Integer userId);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndPassword(String username, String password);

    List<User> findByUsernameContainingIgnoreCase(String searchTerm);

    List<User> findByFollowers_UserId(Integer userId);

    List<User> findByFollowing_UserId(Integer userId);

    @Query("SELECT u FROM User u WHERE u.id NOT IN :excludedIds ORDER BY u.id ASC")
    List<User> findUserSuggestions(@Param("excludedIds") List<Integer> excludedIds, Pageable pageable);

    void deleteById(Integer userId);
}
