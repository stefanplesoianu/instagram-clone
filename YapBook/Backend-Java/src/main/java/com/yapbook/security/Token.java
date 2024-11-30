package com.yapbook.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"Token\"")
@Getter
@Setter
@NoArgsConstructor
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "\"userId\"", nullable = false)
    private Integer userId;

    @Column(name = "\"guestId\"")
    private String guestId;

    @Column(nullable = true)
    private String username;

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false, name = "\"createdAt\"")
    private LocalDateTime createdAt;

    @Column(nullable = false, name = "\"expiryDate\"")
    private LocalDateTime expiryDate;

}
