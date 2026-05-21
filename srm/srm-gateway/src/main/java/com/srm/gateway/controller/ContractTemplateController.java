package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.entity.ContractTemplate;
import com.srm.gateway.mapper.ContractTemplateMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/contract-templates")
@Tag(name = "合同模板管理")
public class ContractTemplateController {
    
    private final ContractTemplateMapper templateMapper;
    
    public ContractTemplateController(ContractTemplateMapper templateMapper) {
        this.templateMapper = templateMapper;
    }
    
    @Operation(summary = "获取模板列表")
    @GetMapping
    public Result<PageResult<ContractTemplate>> getList(
            @RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "status", required = false) String status) {
        log.info("获取合同模板列表, page={}, pageSize={}", page, pageSize);
        
        Page<ContractTemplate> pageParam = new Page<>(page, pageSize);
        QueryWrapper<ContractTemplate> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0);
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("name", keyword).or().like("code", keyword));
        }
        
        if (type != null && !type.isEmpty()) {
            wrapper.eq("type", type);
        }
        
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }
        
        wrapper.orderByAsc("sort_order").orderByDesc("created_at");
        IPage<ContractTemplate> result = templateMapper.selectPage(pageParam, wrapper);
        
        PageResult<ContractTemplate> pageResult = new PageResult<>();
        pageResult.setList(result.getRecords());
        pageResult.setTotal(result.getTotal());
        pageResult.setPage(page);
        pageResult.setPageSize(pageSize);
        
        return Result.success("查询成功", pageResult);
    }
    
    @Operation(summary = "获取模板详情")
    @GetMapping("/{id}")
    public Result<ContractTemplate> getById(@PathVariable("id") Long id) {
        log.info("获取合同模板详情, id={}", id);
        ContractTemplate template = templateMapper.selectById(id);
        if (template == null || template.getDelFlag() == 2) {
            return Result.error(404, "模板不存在");
        }
        return Result.success("查询成功", template);
    }
    
    @Operation(summary = "根据类型获取启用的模板")
    @GetMapping("/type/{type}")
    public Result<List<ContractTemplate>> getByType(@PathVariable("type") String type) {
        log.info("根据类型获取模板, type={}", type);
        QueryWrapper<ContractTemplate> wrapper = new QueryWrapper<>();
        wrapper.eq("type", type)
               .eq("status", "ACTIVE")
               .eq("del_flag", 0)
               .orderByAsc("sort_order");
        List<ContractTemplate> list = templateMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }
    
    @Operation(summary = "创建模板")
    @PostMapping
    public Result<Long> create(@RequestBody ContractTemplate template) {
        log.info("创建合同模板, name={}", template.getName());
        
        if (template.getStatus() == null) {
            template.setStatus("INACTIVE");
        }
        if (template.getSortOrder() == null) {
            template.setSortOrder(0);
        }
        if (template.getVersion() == null) {
            template.setVersion("1.0");
        }
        if (template.getLanguage() == null) {
            template.setLanguage("zh-CN");
        }
        
        template.setDelFlag(0);
        template.setCreatedAt(LocalDateTime.now());
        template.setUpdatedAt(LocalDateTime.now());
        
        templateMapper.insert(template);
        return Result.success("创建成功", template.getId());
    }
    
    @Operation(summary = "更新模板")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody ContractTemplate template) {
        log.info("更新合同模板, id={}", id);
        
        ContractTemplate existing = templateMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "模板不存在");
        }
        
        template.setId(id);
        template.setUpdatedAt(LocalDateTime.now());
        templateMapper.updateById(template);
        
        return Result.success("更新成功", null);
    }
    
    @Operation(summary = "删除模板")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除合同模板, id={}", id);
        
        ContractTemplate existing = templateMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "模板不存在");
        }
        
        existing.setDelFlag(2);
        existing.setUpdatedAt(LocalDateTime.now());
        templateMapper.updateById(existing);
        
        return Result.success("删除成功", null);
    }
    
    @Operation(summary = "更新模板状态")
    @PostMapping("/{id}/status")
    public Result<Void> updateStatus(
            @PathVariable("id") Long id,
            @RequestBody java.util.Map<String, String> params) {
        log.info("更新合同模板状态, id={}, status={}", id, params.get("status"));
        
        ContractTemplate existing = templateMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "模板不存在");
        }
        
        String status = params.get("status");
        if (status == null || status.isEmpty()) {
            return Result.error(400, "状态不能为空");
        }
        
        existing.setStatus(status);
        existing.setUpdatedAt(LocalDateTime.now());
        templateMapper.updateById(existing);
        
        return Result.success("状态更新成功", null);
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
