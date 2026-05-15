package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.entity.Material;
import com.srm.gateway.entity.MaterialSupplier;
import com.srm.gateway.entity.Supplier;
import com.srm.gateway.mapper.MaterialMapper;
import com.srm.gateway.mapper.MaterialSupplierMapper;
import com.srm.gateway.mapper.SupplierMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "物料管理", description = "物料相关接口")
@RestController
@RequestMapping("/api/materials")
public class MaterialController {
    private static final Logger log = LoggerFactory.getLogger(MaterialController.class);
    private final MaterialMapper materialMapper;
    private final MaterialSupplierMapper materialSupplierMapper;
    private final SupplierMapper supplierMapper;

    public MaterialController(MaterialMapper materialMapper, 
                             MaterialSupplierMapper materialSupplierMapper,
                             SupplierMapper supplierMapper) {
        this.materialMapper = materialMapper;
        this.materialSupplierMapper = materialSupplierMapper;
        this.supplierMapper = supplierMapper;
    }

    @Operation(summary = "获取物料列表")
    @GetMapping
    public Result<PageResult<Material>> getList(
            @RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "status", required = false) String status) {
        log.info("获取物料列表, page={}, pageSize={}, keyword={}, category={}, status={}", page, pageSize, keyword, category, status);
        
        Page<Material> pageParam = new Page<>(page, pageSize);
        QueryWrapper<Material> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0);
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("name", keyword).or().like("code", keyword).or().like("specification", keyword).or().like("model", keyword));
        }
        
        if (category != null && !category.isEmpty()) {
            wrapper.eq("category", category);
        }
        
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }
        
        wrapper.orderByDesc("created_at");
        IPage<Material> result = materialMapper.selectPage(pageParam, wrapper);
        
        PageResult<Material> pageResult = new PageResult<>();
        pageResult.setList(result.getRecords());
        pageResult.setTotal(result.getTotal());
        pageResult.setPage(page);
        pageResult.setPageSize(pageSize);
        
        return Result.success("查询成功", pageResult);
    }

    @Operation(summary = "获取物料详情")
    @GetMapping("/{id}")
    public Result<Material> getById(@PathVariable("id") Long id) {
        log.info("获取物料详情, id={}", id);
        Material material = materialMapper.selectById(id);
        if (material == null || material.getDelFlag() == 2) {
            return Result.error(404, "物料不存在");
        }
        return Result.success("查询成功", material);
    }

    @Operation(summary = "创建物料")
    @PostMapping
    public Result<Long> create(@RequestBody Material material) {
        log.info("创建物料, name={}", material.getName());
        
        material.setStatus(material.getStatus() != null ? material.getStatus() : "ACTIVE");
        material.setDelFlag(0);
        material.setCreatedAt(LocalDateTime.now());
        material.setUpdatedAt(LocalDateTime.now());
        
        materialMapper.insert(material);
        return Result.success("创建成功", material.getId());
    }

    @Operation(summary = "更新物料")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody Material material) {
        log.info("更新物料, id={}", id);
        
        Material existing = materialMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "物料不存在");
        }
        
        material.setId(id);
        material.setUpdatedAt(LocalDateTime.now());
        materialMapper.updateById(material);
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除物料")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除物料, id={}", id);
        
        Material existing = materialMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "物料不存在");
        }
        
        UpdateWrapper<Material> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("del_flag", 2);
        wrapper.set("updated_at", LocalDateTime.now());
        materialMapper.update(null, wrapper);
        
        return Result.success("删除成功", null);
    }

    @Operation(summary = "更新物料状态")
    @PostMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable("id") Long id, @RequestBody java.util.Map<String, String> params) {
        log.info("更新物料状态, id={}, status={}", id, params.get("status"));
        
        Material existing = materialMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "物料不存在");
        }
        
        String status = params.get("status");
        if (status == null || status.isEmpty()) {
            return Result.error(400, "状态不能为空");
        }
        
        UpdateWrapper<Material> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", status);
        wrapper.set("updated_at", LocalDateTime.now());
        materialMapper.update(null, wrapper);
        
        return Result.success("状态更新成功", null);
    }

    @Operation(summary = "获取活跃物料列表")
    @GetMapping("/active")
    public Result<List<Material>> getActive() {
        log.info("获取活跃物料列表");
        
        QueryWrapper<Material> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "ACTIVE").eq("del_flag", 0);
        List<Material> list = materialMapper.selectList(wrapper);
        
        return Result.success("查询成功", list);
    }

    @Operation(summary = "获取物料的供应商列表")
    @GetMapping("/{id}/suppliers")
    public Result<List<MaterialSupplierVO>> getMaterialSuppliers(@PathVariable("id") Long id) {
        log.info("获取物料的供应商列表, materialId={}", id);
        
        List<MaterialSupplier> list = materialSupplierMapper.selectByMaterialId(id);
        List<MaterialSupplierVO> voList = list.stream().map(ms -> {
            MaterialSupplierVO vo = new MaterialSupplierVO();
            vo.setId(ms.getId());
            vo.setMaterialId(ms.getMaterialId());
            vo.setMaterialCode(ms.getMaterialCode());
            vo.setSupplierId(ms.getSupplierId());
            vo.setSupplierCode(ms.getSupplierCode());
            vo.setSupplierName(ms.getSupplierName());
            vo.setIsPrimary(ms.getIsPrimary());
            vo.setLeadTime(ms.getLeadTime());
            vo.setMoq(ms.getMoq());
            vo.setStatus(ms.getStatus());
            vo.setRemark(ms.getRemark());
            
            if (ms.getSupplierId() != null) {
                Supplier supplier = supplierMapper.selectById(ms.getSupplierId());
                if (supplier != null) {
                    vo.setSupplierType(supplier.getType());
                    vo.setSupplierStatus(supplier.getStatus());
                }
            }
            return vo;
        }).toList();
        
        return Result.success("查询成功", voList);
    }

    @Operation(summary = "添加物料供应商关联")
    @PostMapping("/{id}/suppliers")
    public Result<Long> addSupplier(@PathVariable("id") Long id, @RequestBody MaterialSupplier ms) {
        log.info("添加物料供应商关联, materialId={}, supplierId={}", id, ms.getSupplierId());
        
        Material material = materialMapper.selectById(id);
        if (material == null || material.getDelFlag() == 2) {
            return Result.error(404, "物料不存在");
        }
        
        if (ms.getSupplierId() == null) {
            return Result.error(400, "供应商不能为空");
        }
        
        QueryWrapper<MaterialSupplier> wrapper = new QueryWrapper<>();
        wrapper.eq("material_id", id);
        wrapper.eq("supplier_id", ms.getSupplierId());
        wrapper.eq("del_flag", 0);
        if (materialSupplierMapper.selectCount(wrapper) > 0) {
            return Result.error(400, "该供应商已关联到此物料");
        }
        
        Supplier supplier = supplierMapper.selectById(ms.getSupplierId());
        if (supplier == null || supplier.getDelFlag() == 2) {
            return Result.error(404, "供应商不存在");
        }
        
        ms.setMaterialId(id);
        ms.setMaterialCode(material.getCode());
        ms.setSupplierCode(supplier.getCode());
        ms.setSupplierName(supplier.getName());
        
        if (ms.getIsPrimary() == null) {
            ms.setIsPrimary(false);
        }
        
        if (ms.getIsPrimary()) {
            resetPrimarySupplier(id);
        }
        
        ms.setDelFlag(0);
        ms.setCreatedAt(LocalDateTime.now());
        ms.setUpdatedAt(LocalDateTime.now());
        
        materialSupplierMapper.insert(ms);
        return Result.success("添加成功", ms.getId());
    }

    @Operation(summary = "更新物料供应商关联")
    @PutMapping("/{materialId}/suppliers/{supplierId}")
    public Result<Void> updateSupplier(
            @PathVariable("materialId") Long materialId,
            @PathVariable("supplierId") Long supplierId,
            @RequestBody MaterialSupplier ms) {
        log.info("更新物料供应商关联, materialId={}, supplierId={}", materialId, supplierId);
        
        QueryWrapper<MaterialSupplier> wrapper = new QueryWrapper<>();
        wrapper.eq("material_id", materialId).eq("supplier_id", supplierId).eq("del_flag", 0);
        MaterialSupplier existing = materialSupplierMapper.selectOne(wrapper);
        
        if (existing == null) {
            return Result.error(404, "关联记录不存在");
        }
        
        if (ms.getIsPrimary() != null && ms.getIsPrimary() && !existing.getIsPrimary()) {
            resetPrimarySupplier(materialId);
        }
        
        ms.setId(existing.getId());
        ms.setUpdatedAt(LocalDateTime.now());
        materialSupplierMapper.updateById(ms);
        
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除物料供应商关联")
    @DeleteMapping("/{materialId}/suppliers/{supplierId}")
    public Result<Void> deleteSupplier(
            @PathVariable("materialId") Long materialId,
            @PathVariable("supplierId") Long supplierId) {
        log.info("删除物料供应商关联, materialId={}, supplierId={}", materialId, supplierId);
        
        UpdateWrapper<MaterialSupplier> wrapper = new UpdateWrapper<>();
        wrapper.eq("material_id", materialId).eq("supplier_id", supplierId);
        wrapper.set("del_flag", 2);
        wrapper.set("updated_at", LocalDateTime.now());
        materialSupplierMapper.update(null, wrapper);
        
        return Result.success("删除成功", null);
    }

    @Operation(summary = "设置主要供应商")
    @PostMapping("/{materialId}/suppliers/{supplierId}/primary")
    public Result<Void> setPrimary(
            @PathVariable("materialId") Long materialId,
            @PathVariable("supplierId") Long supplierId) {
        log.info("设置主要供应商, materialId={}, supplierId={}", materialId, supplierId);
        
        resetPrimarySupplier(materialId);
        
        UpdateWrapper<MaterialSupplier> wrapper = new UpdateWrapper<>();
        wrapper.eq("material_id", materialId).eq("supplier_id", supplierId);
        wrapper.set("is_primary", true);
        wrapper.set("updated_at", LocalDateTime.now());
        materialSupplierMapper.update(null, wrapper);
        
        return Result.success("设置成功", null);
    }

    private void resetPrimarySupplier(Long materialId) {
        UpdateWrapper<MaterialSupplier> wrapper = new UpdateWrapper<>();
        wrapper.eq("material_id", materialId);
        wrapper.set("is_primary", false);
        materialSupplierMapper.update(null, wrapper);
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

    public static class MaterialSupplierVO extends MaterialSupplier {
        private String supplierType;
        private String supplierStatus;

        public String getSupplierType() { return supplierType; }
        public void setSupplierType(String supplierType) { this.supplierType = supplierType; }

        public String getSupplierStatus() { return supplierStatus; }
        public void setSupplierStatus(String supplierStatus) { this.supplierStatus = supplierStatus; }
    }
}
