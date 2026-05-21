package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.srm.gateway.entity.SupplierTag;
import com.srm.gateway.mapper.SupplierTagMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "供应商标签管理", description = "供应商标签相关接口")
@RestController
@RequestMapping("/api/supplier-tags")
public class SupplierTagController {
    private static final Logger log = LoggerFactory.getLogger(SupplierTagController.class);
    private final SupplierTagMapper supplierTagMapper;

    public SupplierTagController(SupplierTagMapper supplierTagMapper) {
        this.supplierTagMapper = supplierTagMapper;
    }

    @Operation(summary = "获取供应商标签列表")
    @GetMapping("/supplier/{supplierId}")
    public Result<List<SupplierTag>> getBySupplierId(@PathVariable("supplierId") Long supplierId) {
        log.info("获取供应商标签列表，供应商ID: {}", supplierId);
        QueryWrapper<SupplierTag> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId)
               .eq("del_flag", 0)
               .orderByDesc("created_at");
        List<SupplierTag> list = supplierTagMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }

    @Operation(summary = "添加标签")
    @PostMapping
    public Result<Long> create(@RequestBody SupplierTag tag) {
        log.info("添加标签，供应商ID: {}, 标签名: {}", tag.getSupplierId(), tag.getTagName());
        
        tag.setDelFlag(0);
        tag.setCreatedAt(LocalDateTime.now());
        
        supplierTagMapper.insert(tag);
        return Result.success("创建成功", tag.getId());
    }

    @Operation(summary = "批量添加标签")
    @PostMapping("/batch")
    public Result<Void> batchCreate(@RequestBody java.util.List<SupplierTag> tags) {
        log.info("批量添加标签，数量: {}", tags.size());
        
        for (SupplierTag tag : tags) {
            tag.setDelFlag(0);
            tag.setCreatedAt(LocalDateTime.now());
            supplierTagMapper.insert(tag);
        }
        
        return Result.success("批量添加成功", null);
    }

    @Operation(summary = "删除标签")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除标签，ID: {}", id);
        
        SupplierTag existing = supplierTagMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "标签不存在");
        }
        
        existing.setDelFlag(2);
        supplierTagMapper.updateById(existing);
        
        return Result.success("删除成功", null);
    }

    @Operation(summary = "批量删除标签")
    @DeleteMapping("/supplier/{supplierId}")
    public Result<Void> deleteBySupplierId(@PathVariable("supplierId") Long supplierId) {
        log.info("批量删除供应商标签，供应商ID: {}", supplierId);
        
        QueryWrapper<SupplierTag> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId);
        List<SupplierTag> tags = supplierTagMapper.selectList(wrapper);
        
        for (SupplierTag tag : tags) {
            tag.setDelFlag(2);
            supplierTagMapper.updateById(tag);
        }
        
        return Result.success("批量删除成功", null);
    }
}
