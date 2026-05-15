package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.common.Result;
import com.srm.gateway.entity.Employee;
import com.srm.gateway.mapper.EmployeeMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Tag(name = "人员管理")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    
    @Autowired
    private EmployeeMapper employeeMapper;
    
    @Operation(summary = "获取员工列表")
    @GetMapping
    public Result<Map<String, Object>> getEmployeeList(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "departmentId", required = false) Long departmentId,
            @RequestParam(value = "status", required = false) String status) {
        try {
            QueryWrapper<Employee> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("del_flag", 0);
            
            if (keyword != null && !keyword.isEmpty()) {
                queryWrapper.and(w -> w.like("name", keyword)
                        .or().like("employee_no", keyword)
                        .or().like("phone", keyword));
            }
            
            if (departmentId != null) {
                queryWrapper.eq("department_id", departmentId);
            }
            
            if (status != null && !status.isEmpty()) {
                queryWrapper.eq("status", status);
            }
            
            queryWrapper.orderByDesc("created_at");
            
            Page<Employee> pageResult = employeeMapper.selectPage(new Page<>(page, pageSize), queryWrapper);
            
            Map<String, Object> result = new HashMap<>();
            result.put("list", pageResult.getRecords());
            result.put("total", pageResult.getTotal());
            result.put("page", page);
            result.put("pageSize", pageSize);
            
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(500, "获取员工列表失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "获取员工详情")
    @GetMapping("/{id}")
    public Result<Employee> getEmployeeById(@PathVariable("id") Long id) {
        try {
            Employee employee = employeeMapper.selectById(id);
            if (employee == null || employee.getDelFlag() != 0) {
                return Result.error(404, "员工不存在");
            }
            return Result.success(employee);
        } catch (Exception e) {
            return Result.error(500, "获取员工详情失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "获取部门下员工列表")
    @GetMapping("/department/{departmentId}")
    public Result<Map<String, Object>> getEmployeesByDepartment(
            @PathVariable("departmentId") Long departmentId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "pageSize", defaultValue = "100") int pageSize) {
        try {
            QueryWrapper<Employee> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("department_id", departmentId);
            queryWrapper.eq("del_flag", 0);
            queryWrapper.eq("status", "ACTIVE");
            queryWrapper.orderByAsc("position", "name");
            
            Page<Employee> pageResult = employeeMapper.selectPage(new Page<>(page, pageSize), queryWrapper);
            
            Map<String, Object> result = new HashMap<>();
            result.put("list", pageResult.getRecords());
            result.put("total", pageResult.getTotal());
            
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(500, "获取部门员工列表失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "创建员工")
    @PostMapping
    public Result<Employee> createEmployee(@RequestBody Employee employee) {
        try {
            QueryWrapper<Employee> noCheck = new QueryWrapper<>();
            noCheck.eq("employee_no", employee.getEmployeeNo());
            noCheck.eq("del_flag", 0);
            if (employeeMapper.selectCount(noCheck).intValue() > 0) {
                return Result.error(400, "员工编号已存在");
            }
            
            employee.setDelFlag(0);
            employee.setStatus("ACTIVE");
            employee.setCreatedAt(LocalDateTime.now());
            employee.setUpdatedAt(LocalDateTime.now());
            
            employeeMapper.insert(employee);
            return Result.success(employee);
        } catch (Exception e) {
            return Result.error(500, "创建员工失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "更新员工")
    @PutMapping("/{id}")
    public Result<Employee> updateEmployee(@PathVariable("id") Long id, @RequestBody Employee employee) {
        try {
            Employee existing = employeeMapper.selectById(id);
            if (existing == null || existing.getDelFlag() != 0) {
                return Result.error(404, "员工不存在");
            }
            
            employee.setId(id);
            employee.setUpdatedAt(LocalDateTime.now());
            employeeMapper.updateById(employee);
            return Result.success(employee);
        } catch (Exception e) {
            return Result.error(500, "更新员工失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "删除员工")
    @DeleteMapping("/{id}")
    public Result<Void> deleteEmployee(@PathVariable("id") Long id) {
        try {
            employeeMapper.deleteById(id);
            return Result.success("删除成功", null);
        } catch (Exception e) {
            return Result.error(500, "删除员工失败: " + e.getMessage());
        }
    }
    
    @Operation(summary = "员工离职")
    @PutMapping("/{id}/leave")
    public Result<Void> leaveEmployee(@PathVariable("id") Long id) {
        try {
            Employee employee = new Employee();
            employee.setId(id);
            employee.setStatus("INACTIVE");
            employee.setLeaveDate(java.time.LocalDate.now());
            employee.setUpdatedAt(LocalDateTime.now());
            employeeMapper.updateById(employee);
            return Result.success("员工已离职", null);
        } catch (Exception e) {
            return Result.error(500, "员工离职处理失败: " + e.getMessage());
        }
    }
}
