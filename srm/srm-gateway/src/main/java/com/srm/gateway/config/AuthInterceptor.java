package com.srm.gateway.config;

import com.srm.gateway.common.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(AuthInterceptor.class);

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    private static final List<String> WHITE_LIST = Arrays.asList(
            "/api/auth/login",
            "/api/auth/register",
            "/swagger-ui/**",
            "/swagger-resources/**",
            "/v3/api-docs/**",
            "/webjars/**",
            "/h2-console/**"
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public AuthInterceptor(JwtUtil jwtUtil, ObjectMapper objectMapper) {
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String requestUri = request.getRequestURI();

        if (isWhiteList(requestUri)) {
            return true;
        }

        String token = extractToken(request);

        if (token == null || token.isEmpty()) {
            log.warn("未提供token: {}", requestUri);
            sendErrorResponse(response, 401, "未登录，请先登录");
            return false;
        }

        try {
            if (!jwtUtil.validateToken(token)) {
                log.warn("无效的token: {}", requestUri);
                sendErrorResponse(response, 401, "登录已过期，请重新登录");
                return false;
            }

            String userId = jwtUtil.getUserIdFromToken(token);
            String username = jwtUtil.getUsernameFromToken(token);

            request.setAttribute("userId", userId);
            request.setAttribute("username", username);

            log.debug("用户认证成功: userId={}, username={}", userId, username);
            return true;

        } catch (Exception e) {
            log.warn("认证失败: {}", e.getMessage());
            sendErrorResponse(response, 401, "认证失败，请重新登录");
            return false;
        }
    }

    private boolean isWhiteList(String requestUri) {
        return WHITE_LIST.stream().anyMatch(pattern -> pathMatcher.match(pattern, requestUri));
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private void sendErrorResponse(HttpServletResponse response, int code, String message) {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(code);
        try (PrintWriter writer = response.getWriter()) {
            Result<Void> result = Result.error(code, message);
            writer.write(objectMapper.writeValueAsString(result));
        } catch (IOException e) {
            log.error("发送错误响应失败", e);
        }
    }

}
