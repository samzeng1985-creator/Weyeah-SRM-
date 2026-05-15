package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.entity.Material;
import com.srm.gateway.mapper.MaterialMapper;
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

    public MaterialController(MaterialMapper materialMapper) {
        this.materialMapper = materialMapper;
    }

    @Operation(summary = "获取物料列表")
    @GetMapping
    public Result<PageResult<Material>> getList(
            @RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "category", required = false) String category) {
        log.info("获取物料列表, page={}, pageSize={}, keyword={}, category={}", page, pageSize, keyword, category);
        
        Page<Material> pageParam = new Page<>(page, pageSize);
        QueryWrapper<Material> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0);
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("name", keyword).or().like("code", keyword).or().like("specification", keyword));
        }
        
        if (category != null && !category.isEmpty()) {
            wrapper.eq("category", category);
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
        if (material == null) {
            return Result.error(404, "物料不存在");
        }
        return Result.success("查询成功", material);
    }

    @Operation(summary = "创建物料")
    @PostMapping
    public Result<Long> create(@RequestBody Material material) {
        log.info("创建物料, name={}", material.getName());
        
        material.setStatus("ACTIVE");
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
        if (existing == null) {
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
        if (existing == null) {
            return Result.error(404, "物料不存在");
        }
        
        int result = materialMapper.deleteById(id);
        if (result > 0) {
            return Result.success("删除成功", null);
        } else {
            return Result.error(500, "删除失败");
        }
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
