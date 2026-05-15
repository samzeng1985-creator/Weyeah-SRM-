package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.entity.Supplier;
import com.srm.gateway.mapper.SupplierMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "供应商管理", description = "供应商相关接口")
@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    private static final Logger log = LoggerFactory.getLogger(SupplierController.class);
    private final SupplierMapper supplierMapper;

    public SupplierController(SupplierMapper supplierMapper) {
        this.supplierMapper = supplierMapper;
    }

    @Operation(summary = "获取供应商列表")
    @GetMapping
    public Result<PageResult<Supplier>> getList(
            @RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "status", required = false) String status) {
        log.info("获取供应商列表, page={}, pageSize={}, keyword={}, status={}", page, pageSize, keyword, status);
        
        Page<Supplier> pageParam = new Page<>(page, pageSize);
        QueryWrapper<Supplier> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0);
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("name", keyword).or().like("code", keyword));
        }
        
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }
        
        wrapper.orderByDesc("created_at");
        IPage<Supplier> result = supplierMapper.selectPage(pageParam, wrapper);
        
        PageResult<Supplier> pageResult = new PageResult<>();
        pageResult.setList(result.getRecords());
        pageResult.setTotal(result.getTotal());
        pageResult.setPage(page);
        pageResult.setPageSize(pageSize);
        
        return Result.success("查询成功", pageResult);
    }

    @Operation(summary = "获取供应商详情")
    @GetMapping("/{id}")
    public Result<Supplier> getById(@PathVariable("id") Long id) {
        log.info("获取供应商详情, id={}", id);
        Supplier supplier = supplierMapper.selectById(id);
        if (supplier == null) {
            return Result.error(404, "供应商不存在");
        }
        return Result.success("查询成功", supplier);
    }

    @Operation(summary = "创建供应商")
    @PostMapping
    public Result<Long> create(@RequestBody Supplier supplier) {
        log.info("创建供应商, name={}", supplier.getName());
        
        supplier.setStatus("DRAFT");
        supplier.setDelFlag(0);
        supplier.setCreatedAt(LocalDateTime.now());
        supplier.setUpdatedAt(LocalDateTime.now());
        
        supplierMapper.insert(supplier);
        return Result.success("创建成功", supplier.getId());
    }

    @Operation(summary = "更新供应商")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody Supplier supplier) {
        log.info("更新供应商, id={}", id);
        
        Supplier existing = supplierMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "供应商不存在");
        }
        
        supplier.setId(id);
        supplier.setUpdatedAt(LocalDateTime.now());
        supplierMapper.updateById(supplier);
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除供应商")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除供应商, id={}", id);
        
        Supplier existing = supplierMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "供应商不存在");
        }
        
        int result = supplierMapper.deleteById(id);
        if (result > 0) {
            return Result.success("删除成功", null);
        } else {
            return Result.error(500, "删除失败");
        }
    }

    @Operation(summary = "获取活跃供应商列表")
    @GetMapping("/active")
    public Result<List<Supplier>> getActive() {
        log.info("获取活跃供应商列表");
        
        QueryWrapper<Supplier> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "QUALIFIED").eq("del_flag", 0);
        List<Supplier> list = supplierMapper.selectList(wrapper);
        
        return Result.success("查询成功", list);
    }

    public static class PageResult<T> {
        private List<T> list;
        private Long total;
        private Integer page;
        private Integer pageSize;

        public List<T> getList() {
            return list;
        }

        public void setList(List<T> list) {
            this.list = list;
        }

        public Long getTotal() {
            return total;
        }

        public void setTotal(Long total) {
            this.total = total;
        }

        public Integer getPage() {
            return page;
        }

        public void setPage(Integer page) {
            this.page = page;
        }

        public Integer getPageSize() {
            return pageSize;
        }

        public void setPageSize(Integer pageSize) {
            this.pageSize = pageSize;
        }
    }
}
