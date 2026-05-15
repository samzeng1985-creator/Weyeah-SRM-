package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.srm.gateway.common.Result;
import com.srm.gateway.entity.Permission;
import com.srm.gateway.entity.Role;
import com.srm.gateway.mapper.PermissionMapper;
import com.srm.gateway.mapper.RoleMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@Tag(name = "角色权限管理")
@RestController
@RequestMapping("/api/roles")
public class RoleController {
    
    @Autowired
    private RoleMapper roleMapper;
    
    @Autowired
    private PermissionMapper permissionMapper;
    
    @Operation(summary = "获取角色列表")
    @GetMapping
    public Result<List<Role>> getRoleList() {
        try {
            QueryWrapper<Role> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("del_flag", 0);
            queryWrapper.orderByAsc("sort_order");
            List<Role> roles = roleMapper.selectList(queryWrapper);
            return Result.success(roles);
        } catch (Exception e) {
            return Result.error(500, "获取角色列表失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "获取角色详情")
    @GetMapping("/{id}")
    public Result<Role> getRoleById(@PathVariable("id") Long id) {
        try {
            Role role = roleMapper.selectById(id);
            if (role == null || role.getDelFlag() != 0) {
                return Result.error(404, "角色不存在");
            }
            return Result.success(role);
        } catch (Exception e) {
            return Result.error(500, "获取角色详情失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "创建角色")
    @PostMapping
    public Result<Role> createRole(@RequestBody Role role) {
        try {
            QueryWrapper<Role> codeCheck = new QueryWrapper<>();
            codeCheck.eq("code", role.getCode());
            codeCheck.eq("del_flag", 0);
            if (roleMapper.selectCount(codeCheck).intValue() > 0) {
                return Result.error(400, "角色编码已存在");
            }
            
            role.setDelFlag(0);
            role.setIsSystem(0);
            role.setCreatedAt(LocalDateTime.now());
            role.setUpdatedAt(LocalDateTime.now());
            roleMapper.insert(role);
            return Result.success(role);
        } catch (Exception e) {
            return Result.error(500, "创建角色失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "更新角色")
    @PutMapping("/{id}")
    public Result<Role> updateRole(@PathVariable("id") Long id, @RequestBody Role role) {
        try {
            Role existing = roleMapper.selectById(id);
            if (existing == null || existing.getDelFlag() != 0) {
                return Result.error(404, "角色不存在");
            }
            role.setId(id);
            role.setUpdatedAt(LocalDateTime.now());
            roleMapper.updateById(role);
            return Result.success(role);
        } catch (Exception e) {
            return Result.error(500, "更新角色失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "删除角色")
    @DeleteMapping("/{id}")
    public Result<Void> deleteRole(@PathVariable("id") Long id) {
        try {
            Role role = roleMapper.selectById(id);
            if (role != null && role.getIsSystem() == 1) {
                return Result.error(400, "系统预置角色不可删除");
            }
            roleMapper.deleteById(id);
            return Result.success("删除成功", null);
        } catch (Exception e) {
            return Result.error(500, "删除角色失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "获取权限列表（树形结构）")
    @GetMapping("/permissions/tree")
    public Result<List<Map<String, Object>>> getPermissionTree() {
        try {
            QueryWrapper<Permission> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("del_flag", 0);
            queryWrapper.eq("status", "ACTIVE");
            queryWrapper.orderByAsc("sort_order");
            List<Permission> allPerms = permissionMapper.selectList(queryWrapper);
            
            List<Map<String, Object>> tree = buildPermissionTree(allPerms, 0L);
            return Result.success(tree);
        } catch (Exception e) {
            return Result.error(500, "获取权限树失败: " + e.getMessage());
        }
    }
    
    private List<Map<String, Object>> buildPermissionTree(List<Permission> allPerms, Long parentId) {
        List<Map<String, Object>> tree = new ArrayList<>();
        for (Permission perm : allPerms) {
            if (Objects.equals(perm.getParentId(), parentId)) {
                Map<String, Object> node = new HashMap<>();
                node.put("id", perm.getId());
                node.put("code", perm.getCode());
                node.put("name", perm.getName());
                node.put("module", perm.getModule());
                node.put("type", perm.getType());
                node.put("parentId", perm.getParentId());
                node.put("path", perm.getPath());
                node.put("icon", perm.getIcon());
                
                List<Map<String, Object>> children = buildPermissionTree(allPerms, perm.getId());
                if (!children.isEmpty()) {
                    node.put("children", children);
                }
                tree.add(node);
            }
        }
        return tree;
    }
}
