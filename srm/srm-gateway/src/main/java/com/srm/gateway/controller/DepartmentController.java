package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.common.Result;
import com.srm.gateway.entity.Department;
import com.srm.gateway.mapper.DepartmentMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@Tag(name = "部门管理")
@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    
    @Autowired
    private DepartmentMapper departmentMapper;
    
    @Operation(summary = "获取部门列表（树形结构）")
    @GetMapping("/tree")
    public Result<List<Map<String, Object>>> getDepartmentTree() {
        try {
            QueryWrapper<Department> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("del_flag", 0);
            queryWrapper.eq("status", "ACTIVE");
            queryWrapper.orderByAsc("sort_order");
            List<Department> allDepts = departmentMapper.selectList(queryWrapper);
            
            List<Map<String, Object>> tree = buildDepartmentTree(allDepts, 0L);
            return Result.success(tree);
        } catch (Exception e) {
            return Result.error(500, "获取部门树失败: " + e.getMessage());
        }
    }
    
    private List<Map<String, Object>> buildDepartmentTree(List<Department> allDepts, Long parentId) {
        List<Map<String, Object>> tree = new ArrayList<>();
        for (Department dept : allDepts) {
            if (Objects.equals(dept.getParentId(), parentId)) {
                Map<String, Object> node = new HashMap<>();
                node.put("id", dept.getId());
                node.put("code", dept.getCode());
                node.put("name", dept.getName());
                node.put("parentId", dept.getParentId());
                node.put("level", dept.getLevel());
                node.put("leaderId", dept.getLeaderId());
                node.put("leaderName", dept.getLeaderName());
                node.put("description", dept.getDescription());
                node.put("status", dept.getStatus());
                node.put("sortOrder", dept.getSortOrder());
                node.put("createdAt", dept.getCreatedAt());
                
                List<Map<String, Object>> children = buildDepartmentTree(allDepts, dept.getId());
                if (!children.isEmpty()) {
                    node.put("children", children);
                }
                tree.add(node);
            }
        }
        return tree;
    }
    
    @Operation(summary = "获取部门列表")
    @GetMapping
    public Result<Map<String, Object>> getDepartmentList(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "pageSize", defaultValue = "100") int pageSize,
            @RequestParam(value = "keyword", required = false) String keyword) {
        try {
            QueryWrapper<Department> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("del_flag", 0);
            if (keyword != null && !keyword.isEmpty()) {
                queryWrapper.and(w -> w.like("name", keyword).or().like("code", keyword));
            }
            queryWrapper.orderByAsc("sort_order");
            
            Page<Department> pageResult = departmentMapper.selectPage(new Page<>(page, pageSize), queryWrapper);
            
            Map<String, Object> result = new HashMap<>();
            result.put("list", pageResult.getRecords());
            result.put("total", pageResult.getTotal());
            result.put("page", page);
            result.put("pageSize", pageSize);
            
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(500, "获取部门列表失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "获取部门详情")
    @GetMapping("/{id}")
    public Result<Department> getDepartmentById(@PathVariable("id") Long id) {
        try {
            Department dept = departmentMapper.selectById(id);
            if (dept == null || dept.getDelFlag() != 0) {
                return Result.error(404, "部门不存在");
            }
            return Result.success(dept);
        } catch (Exception e) {
            return Result.error(500, "获取部门详情失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "创建部门")
    @PostMapping
    public Result<Department> createDepartment(@RequestBody Department department) {
        try {
            QueryWrapper<Department> codeCheck = new QueryWrapper<>();
            codeCheck.eq("code", department.getCode());
            codeCheck.eq("del_flag", 0);
            if (departmentMapper.selectCount(codeCheck).intValue() > 0) {
                return Result.error(400, "部门编码已存在");
            }
            
            department.setDelFlag(0);
            department.setStatus("ACTIVE");
            department.setCreatedAt(LocalDateTime.now());
            department.setUpdatedAt(LocalDateTime.now());
            
            if (department.getSortOrder() == null) {
                department.setSortOrder(0);
            }
            
            if (department.getLevel() == null) {
                department.setLevel(1);
            }
            
            departmentMapper.insert(department);
            return Result.success(department);
        } catch (Exception e) {
            return Result.error(500, "创建部门失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "更新部门")
    @PutMapping("/{id}")
    public Result<Department> updateDepartment(@PathVariable("id") Long id, @RequestBody Department department) {
        try {
            Department existing = departmentMapper.selectById(id);
            if (existing == null || existing.getDelFlag() != 0) {
                return Result.error(404, "部门不存在");
            }
            
            department.setId(id);
            department.setUpdatedAt(LocalDateTime.now());
            departmentMapper.updateById(department);
            return Result.success(department);
        } catch (Exception e) {
            return Result.error(500, "更新部门失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "删除部门")
    @DeleteMapping("/{id}")
    public Result<Void> deleteDepartment(@PathVariable("id") Long id) {
        try {
            QueryWrapper<Department> childCheck = new QueryWrapper<>();
            childCheck.eq("parent_id", id);
            childCheck.eq("del_flag", 0);
            if (departmentMapper.selectCount(childCheck).intValue() > 0) {
                return Result.error(400, "该部门存在下级部门，无法删除");
            }
            
            departmentMapper.deleteById(id);
            return Result.success("删除成功", null);
        } catch (Exception e) {
            return Result.error(500, "删除部门失败: " + e.getMessage());
        }
    }
}
