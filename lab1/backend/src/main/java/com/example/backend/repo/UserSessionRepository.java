package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.UserSession;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    UserSession findBySessionId(String sessionId);
}
