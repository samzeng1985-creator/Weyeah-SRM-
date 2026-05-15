package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.entity.Pricing;
import com.srm.gateway.entity.Supplier;
import com.srm.gateway.entity.Material;
import com.srm.gateway.mapper.PricingMapper;
import com.srm.gateway.mapper.SupplierMapper;
import com.srm.gateway.mapper.MaterialMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "定价管理", description = "定价相关接口")
@RestController
@RequestMapping("/api/pricing")
public class PricingController {
    private static final Logger log = LoggerFactory.getLogger(PricingController.class);
    private final PricingMapper pricingMapper;
    private final SupplierMapper supplierMapper;
    private final MaterialMapper materialMapper;

    public PricingController(PricingMapper pricingMapper, SupplierMapper supplierMapper, MaterialMapper materialMapper) {
        this.pricingMapper = pricingMapper;
        this.supplierMapper = supplierMapper;
        this.materialMapper = materialMapper;
    }

    @Operation(summary = "获取定价列表")
    @GetMapping
    public Result<PageResult<Map<String, Object>>> getList(
            @RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "status", required = false) String status) {
        log.info("获取定价列表, page={}, pageSize={}, keyword={}, status={}", page, pageSize, keyword, status);
        
        Page<Pricing> pageParam = new Page<>(page, pageSize);
        QueryWrapper<Pricing> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0);
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("code", keyword).or().like("remark", keyword));
        }
        
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }
        
        wrapper.orderByDesc("created_at");
        IPage<Pricing> result = pricingMapper.selectPage(pageParam, wrapper);
        
        List<Map<String, Object>> enrichedList = result.getRecords().stream().map(pricing -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", pricing.getId());
            map.put("code", pricing.getCode());
            map.put("price", pricing.getPrice());
            map.put("currency", pricing.getCurrency());
            map.put("unit", pricing.getUnit());
            map.put("effectiveDate", pricing.getEffectiveDate());
            map.put("expiryDate", pricing.getExpiryDate());
            map.put("status", pricing.getStatus());
            map.put("remark", pricing.getRemark());
            map.put("createdAt", pricing.getCreatedAt());
            
            if (pricing.getSupplierId() != null) {
                Supplier supplier = supplierMapper.selectById(pricing.getSupplierId());
                map.put("supplierId", pricing.getSupplierId());
                map.put("supplierName", supplier != null ? supplier.getName() : "");
            } else {
                map.put("supplierId", null);
                map.put("supplierName", "");
            }
            
            if (pricing.getMaterialId() != null) {
                Material material = materialMapper.selectById(pricing.getMaterialId());
                map.put("materialId", pricing.getMaterialId());
                map.put("materialName", material != null ? material.getName() : "");
            } else {
                map.put("materialId", null);
                map.put("materialName", "");
            }
            
            return map;
        }).toList();
        
        PageResult<Map<String, Object>> pageResult = new PageResult<>();
        pageResult.setList(enrichedList);
        pageResult.setTotal(result.getTotal());
        pageResult.setPage(page);
        pageResult.setPageSize(pageSize);
        
        return Result.success("查询成功", pageResult);
    }

    @Operation(summary = "创建定价")
    @PostMapping
    public Result<Long> create(@RequestBody Pricing pricing) {
        log.info("创建定价, code={}", pricing.getCode());
        
        if (pricing.getCode() == null || pricing.getCode().isEmpty()) {
            pricing.setCode(generateCode());
        }
        pricing.setStatus("PENDING");
        pricing.setDelFlag(0);
        pricing.setCreatedAt(LocalDateTime.now());
        pricing.setUpdatedAt(LocalDateTime.now());
        
        pricingMapper.insert(pricing);
        return Result.success("创建成功", pricing.getId());
    }

    @Operation(summary = "更新定价")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody Pricing pricing) {
        log.info("更新定价, id={}", id);
        
        Pricing existing = pricingMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "定价记录不存在");
        }
        
        pricing.setId(id);
        pricing.setUpdatedAt(LocalDateTime.now());
        pricingMapper.updateById(pricing);
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除定价")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除定价, id={}", id);
        
        Pricing existing = pricingMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "定价记录不存在");
        }
        
        int result = pricingMapper.deleteById(id);
        if (result > 0) {
            return Result.success("删除成功", null);
        } else {
            return Result.error(500, "删除失败");
        }
    }

    @Operation(summary = "获取活跃供应商列表")
    @GetMapping("/suppliers")
    public Result<List<Supplier>> getActiveSuppliers() {
        QueryWrapper<Supplier> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "QUALIFIED").eq("del_flag", 0);
        return Result.success("查询成功", supplierMapper.selectList(wrapper));
    }

    @Operation(summary = "获取活跃物料列表")
    @GetMapping("/materials")
    public Result<List<Material>> getActiveMaterials() {
        QueryWrapper<Material> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "ACTIVE").eq("del_flag", 0);
        return Result.success("查询成功", materialMapper.selectList(wrapper));
    }

    private String generateCode() {
        return "PRC" + System.currentTimeMillis();
    }

    public static class PageResult<T> {
        private List<T> list;
        private Long total;
        private Integer page;
        private Integer pageSize;

        public List<T> getList() { return list; }
        public void setList(List<T> list) { this.list = list; }
        public Long getTotal() { return total; }
        public void setTotal(Long total) { this.total = total; }
        public Integer getPage() { return page; }
        public void setPage(Integer page) { this.page = page; }
        public Integer getPageSize() { return pageSize; }
        public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }
    }
}
