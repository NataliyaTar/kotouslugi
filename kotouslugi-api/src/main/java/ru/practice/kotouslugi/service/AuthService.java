package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;

@Service
public class AuthService {
    public Long getCurrentUserId(String authHeader) {
        // TODO: реализовать получение userId из токена/сессии
        return 1L;
    }
} 