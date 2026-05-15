package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.entity.Contract;
import com.srm.gateway.mapper.ContractMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "合同管理", description = "合同相关接口")
@RestController
@RequestMapping("/api/contracts")
public class ContractController {
    private static final Logger log = LoggerFactory.getLogger(ContractController.class);
    private final ContractMapper contractMapper;

    public ContractController(ContractMapper contractMapper) {
        this.contractMapper = contractMapper;
    }

    @Operation(summary = "获取合同列表")
    @GetMapping
    public Result<PageResult<Contract>> getList(
            @RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "status", required = false) String status) {
        log.info("获取合同列表, page={}, pageSize={}, keyword={}, status={}", page, pageSize, keyword, status);
        
        Page<Contract> pageParam = new Page<>(page, pageSize);
        QueryWrapper<Contract> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0);
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("name", keyword).or().like("code", keyword));
        }
        
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }
        
        wrapper.orderByDesc("created_at");
        IPage<Contract> result = contractMapper.selectPage(pageParam, wrapper);
        
        PageResult<Contract> pageResult = new PageResult<>();
        pageResult.setList(result.getRecords());
        pageResult.setTotal(result.getTotal());
        pageResult.setPage(page);
        pageResult.setPageSize(pageSize);
        
        return Result.success("查询成功", pageResult);
    }

    @Operation(summary = "获取合同详情")
    @GetMapping("/{id}")
    public Result<Contract> getById(@PathVariable("id") Long id) {
        log.info("获取合同详情, id={}", id);
        Contract contract = contractMapper.selectById(id);
        if (contract == null) {
            return Result.error(404, "合同不存在");
        }
        return Result.success("查询成功", contract);
    }

    @Operation(summary = "创建合同")
    @PostMapping
    public Result<Long> create(@RequestBody Contract contract) {
        log.info("创建合同, name={}", contract.getName());
        
        contract.setStatus("DRAFT");
        contract.setDelFlag(0);
        contract.setCreatedAt(LocalDateTime.now());
        contract.setUpdatedAt(LocalDateTime.now());
        
        contractMapper.insert(contract);
        return Result.success("创建成功", contract.getId());
    }

    @Operation(summary = "更新合同")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody Contract contract) {
        log.info("更新合同, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "合同不存在");
        }
        
        contract.setId(id);
        contract.setUpdatedAt(LocalDateTime.now());
        contractMapper.updateById(contract);
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除合同")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除合同, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "合同不存在");
        }
        
        int result = contractMapper.deleteById(id);
        if (result > 0) {
            return Result.success("删除成功", null);
        } else {
            return Result.error(500, "删除失败");
        }
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
