package com.weyeah.srm.organization.controller;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.organization.dto.UserCreateDTO;
import com.weyeah.srm.organization.dto.UserQueryDTO;
import com.weyeah.srm.organization.dto.UserUpdateDTO;
import com.weyeah.srm.organization.entity.OrgUser;
import com.weyeah.srm.organization.service.UserService;
import com.weyeah.srm.organization.vo.UserDetailVO;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "用户管理", description = "用户相关接口")
@RestController
@RequestMapping("/api/organization/users")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class UserController {

    private final UserService userService;

    @Operation(summary = "分页查询用户")
    @GetMapping
    public Result<PageResult<OrgUser>> queryPage(UserQueryDTO queryDTO) {
        PageResult<OrgUser> page = userService.queryPage(queryDTO);
        return Result.success(page);
    }

    @Operation(summary = "获取用户详情")
    @GetMapping("/{id}")
    public Result<UserDetailVO> getById(@PathVariable Long id) {
        UserDetailVO vo = userService.getById(id);
        return Result.success(vo);
    }

    @Operation(summary = "根据用户名获取用户")
    @GetMapping("/username/{username}")
    public Result<OrgUser> getByUsername(@PathVariable String username) {
        OrgUser user = userService.getByUsername(username);
        return Result.success(user);
    }

    @Operation(summary = "根据部门获取用户列表")
    @GetMapping("/department/{departmentId}")
    public Result<List<OrgUser>> listByDepartment(@PathVariable Long departmentId) {
        List<OrgUser> users = userService.listByDepartment(departmentId);
        return Result.success(users);
    }

    @Operation(summary = "创建用户")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody UserCreateDTO createDTO) {
        Long id = userService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新用户")
    @PutMapping
    public Result<Void> update(@Valid @RequestBody UserUpdateDTO updateDTO) {
        userService.update(updateDTO);
        return Result.success();
    }

    @Operation(summary = "更新用户状态")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        userService.updateStatus(id, status);
        return Result.success();
    }

    @Operation(summary = "重置密码")
    @PutMapping("/{id}/reset-password")
    public Result<Void> resetPassword(@PathVariable Long id, @RequestParam String newPassword) {
        userService.resetPassword(id, newPassword);
        return Result.success();
    }

    @Operation(summary = "删除用户")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }
}
