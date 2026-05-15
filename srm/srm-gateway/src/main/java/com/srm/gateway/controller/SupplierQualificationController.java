package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.srm.gateway.entity.SupplierQualification;
import com.srm.gateway.mapper.SupplierQualificationMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Tag(name = "供应商资质文件管理", description = "供应商资质文件相关接口")
@RestController
@RequestMapping("/api/supplier-qualifications")
public class SupplierQualificationController {
    private static final Logger log = LoggerFactory.getLogger(SupplierQualificationController.class);
    private final SupplierQualificationMapper supplierQualificationMapper;

    public SupplierQualificationController(SupplierQualificationMapper supplierQualificationMapper) {
        this.supplierQualificationMapper = supplierQualificationMapper;
    }

    @Operation(summary = "获取所有供应商资质文件列表")
    @GetMapping
    public Result<List<SupplierQualification>> getAll() {
        log.info("获取所有供应商资质文件列表");
        QueryWrapper<SupplierQualification> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0)
               .orderByDesc("created_at");
        List<SupplierQualification> list = supplierQualificationMapper.selectList(wrapper);
        
        // 自动更新资质状态
        updateQualificationStatus(list);
        
        return Result.success("查询成功", list);
    }

    @Operation(summary = "获取供应商资质文件列表")
    @GetMapping("/supplier/{supplierId}")
    public Result<List<SupplierQualification>> getBySupplierId(@PathVariable("supplierId") Long supplierId) {
        log.info("获取供应商资质文件列表，供应商ID: {}", supplierId);
        QueryWrapper<SupplierQualification> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId)
               .eq("del_flag", 0)
               .orderByDesc("created_at");
        List<SupplierQualification> list = supplierQualificationMapper.selectList(wrapper);
        
        // 自动更新资质状态
        updateQualificationStatus(list);
        
        return Result.success("查询成功", list);
    }

    @Operation(summary = "获取资质文件详情")
    @GetMapping("/{id}")
    public Result<SupplierQualification> getById(@PathVariable("id") Long id) {
        log.info("获取资质文件详情，ID: {}", id);
        SupplierQualification qualification = supplierQualificationMapper.selectById(id);
        if (qualification == null) {
            return Result.error(404, "资质文件不存在");
        }
        return Result.success("查询成功", qualification);
    }

    @Operation(summary = "新增资质文件")
    @PostMapping
    public Result<Long> create(@RequestBody SupplierQualification qualification) {
        log.info("新增资质文件，供应商ID: {}, 类型: {}", qualification.getSupplierId(), qualification.getType());
        
        qualification.setStatus("VALID");
        qualification.setDelFlag(0);
        qualification.setCreatedAt(LocalDateTime.now());
        qualification.setUpdatedAt(LocalDateTime.now());
        
        // 计算初始状态
        if (qualification.getHasExpiry() && qualification.getExpiryDate() != null) {
            updateStatusForQualification(qualification);
        }
        
        supplierQualificationMapper.insert(qualification);
        return Result.success("创建成功", qualification.getId());
    }

    @Operation(summary = "更新资质文件")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody SupplierQualification qualification) {
        log.info("更新资质文件，ID: {}", id);
        
        SupplierQualification existing = supplierQualificationMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "资质文件不存在");
        }
        
        qualification.setId(id);
        qualification.setUpdatedAt(LocalDateTime.now());
        
        // 更新状态
        if (qualification.getHasExpiry() && qualification.getExpiryDate() != null) {
            updateStatusForQualification(qualification);
        }
        
        supplierQualificationMapper.updateById(qualification);
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除资质文件")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除资质文件，ID: {}", id);
        
        SupplierQualification existing = supplierQualificationMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "资质文件不存在");
        }
        
        // 逻辑删除
        existing.setDelFlag(2);
        existing.setUpdatedAt(LocalDateTime.now());
        supplierQualificationMapper.updateById(existing);
        
        return Result.success("删除成功", null);
    }

    @Operation(summary = "获取即将过期的资质文件")
    @GetMapping("/expiring-soon")
    public Result<List<SupplierQualification>> getExpiringSoon() {
        log.info("获取即将过期的资质文件");
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);
        
        QueryWrapper<SupplierQualification> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0)
               .eq("has_expiry", true)
               .ge("expiry_date", today)
               .le("expiry_date", thirtyDaysLater)
               .orderByAsc("expiry_date");
        
        List<SupplierQualification> list = supplierQualificationMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }

    @Operation(summary = "获取已过期的资质文件")
    @GetMapping("/expired")
    public Result<List<SupplierQualification>> getExpired() {
        log.info("获取已过期的资质文件");
        LocalDate today = LocalDate.now();
        
        QueryWrapper<SupplierQualification> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0)
               .eq("has_expiry", true)
               .lt("expiry_date", today)
               .orderByAsc("expiry_date");
        
        List<SupplierQualification> list = supplierQualificationMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }

    private void updateQualificationStatus(List<SupplierQualification> list) {
        LocalDate today = LocalDate.now();
        for (SupplierQualification qualification : list) {
            if (qualification.getHasExpiry() && qualification.getExpiryDate() != null) {
                String newStatus = calculateStatus(qualification.getExpiryDate(), today);
                if (!newStatus.equals(qualification.getStatus())) {
                    qualification.setStatus(newStatus);
                    qualification.setUpdatedAt(LocalDateTime.now());
                    supplierQualificationMapper.updateById(qualification);
                }
            }
        }
    }

    private void updateStatusForQualification(SupplierQualification qualification) {
        LocalDate today = LocalDate.now();
        qualification.setStatus(calculateStatus(qualification.getExpiryDate(), today));
    }

    private String calculateStatus(LocalDate expiryDate, LocalDate today) {
        long daysUntilExpiry = ChronoUnit.DAYS.between(today, expiryDate);
        
        if (daysUntilExpiry < 0) {
            return "EXPIRED";
        } else if (daysUntilExpiry <= 30) {
            return "EXPIRING_SOON";
        } else {
            return "VALID";
        }
    }
}
