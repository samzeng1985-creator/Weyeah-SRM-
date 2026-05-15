package com.srm.gateway.controller;

import com.srm.gateway.config.JwtUtil;
import com.srm.gateway.controller.dto.LoginRequest;
import com.srm.gateway.controller.dto.LoginResponse;
import com.srm.gateway.entity.OrgUser;
import com.srm.gateway.mapper.OrgUserMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "认证管理", description = "登录注册相关接口")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final OrgUserMapper userMapper;
    private final JwtUtil jwtUtil;

    public AuthController(OrgUserMapper userMapper, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
    }

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();
        
        log.info("Login attempt for user: {}", username);
        
        OrgUser user = userMapper.selectByUsername(username);
        
        if (user == null) {
            log.warn("Login failed: user not found - {}", username);
            return Result.error(401, "用户名或密码错误");
        }

        if (!StringUtils.hasText(user.getPassword()) || !user.getPassword().equals(password)) {
            log.warn("Login failed: wrong password for user - {}", username);
            return Result.error(401, "用户名或密码错误");
        }

        String token = jwtUtil.generateToken(String.valueOf(user.getId()), user.getUsername());
        log.info("Login success for user: {}", username);

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setRealName(user.getRealName());

        return Result.success("登录成功", response);
    }
}
