package com.yapbook.security;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BlacklistTokenRepository extends JpaRepository<BlacklistToken, Long> {
    Optional<BlacklistToken> findByToken(String token);
}
