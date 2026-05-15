package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.srm.gateway.entity.ContractItem;
import com.srm.gateway.entity.Material;
import com.srm.gateway.mapper.ContractItemMapper;
import com.srm.gateway.mapper.MaterialMapper;
import com.srm.gateway.common.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "合同明细管理", description = "合同明细相关接口")
@RestController
@RequestMapping("/api/contract-items")
public class ContractItemController {
    private static final Logger log = LoggerFactory.getLogger(ContractItemController.class);
    private final ContractItemMapper contractItemMapper;
    private final MaterialMapper materialMapper;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ContractItemController(ContractItemMapper contractItemMapper, MaterialMapper materialMapper) {
        this.contractItemMapper = contractItemMapper;
        this.materialMapper = materialMapper;
    }

    @Operation(summary = "获取合同明细列表")
    @GetMapping("/contract/{contractId}")
    public Result<List<ContractItem>> getByContractId(@PathVariable("contractId") Long contractId) {
        log.info("获取合同明细列表, contractId={}", contractId);
        QueryWrapper<ContractItem> wrapper = new QueryWrapper<>();
        wrapper.eq("contract_id", contractId)
               .eq("del_flag", 0)
               .orderByAsc("sort_order");
        List<ContractItem> list = contractItemMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }

    @Operation(summary = "获取合同明细详情")
    @GetMapping("/{id}")
    public Result<ContractItem> getById(@PathVariable("id") Long id) {
        log.info("获取合同明细详情, id={}", id);
        ContractItem item = contractItemMapper.selectById(id);
        if (item == null) {
            return Result.error(404, "合同明细不存在");
        }
        return Result.success("查询成功", item);
    }

    @Operation(summary = "创建合同明细")
    @PostMapping
    @Transactional
    public Result<Long> create(@RequestBody ContractItem item) {
        log.info("创建合同明细, contractId={}", item.getContractId());
        
        // 获取物料信息并创建快照
        if (item.getMaterialId() != null) {
            Material material = materialMapper.selectById(item.getMaterialId());
            if (material != null) {
                item.setMaterialCode(material.getCode());
                item.setMaterialName(material.getName());
                item.setMaterialSpec(material.getSpecification());
                item.setMaterialModel(material.getCategory());
                
                try {
                    item.setSnapshotData(objectMapper.writeValueAsString(material));
                } catch (Exception e) {
                    log.warn("序列化物料快照失败", e);
                }
            }
        }
        
        // 计算总价
        if (item.getQuantity() != null && item.getUnitPrice() != null) {
            item.setTotalPrice(item.getQuantity().multiply(item.getUnitPrice()));
        }
        
        item.setDelFlag(0);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        
        contractItemMapper.insert(item);
        return Result.success("创建成功", item.getId());
    }

    @Operation(summary = "批量创建合同明细")
    @PostMapping("/batch")
    @Transactional
    public Result<Void> createBatch(@RequestBody List<ContractItem> items) {
        log.info("批量创建合同明细, size={}", items.size());
        
        for (ContractItem item : items) {
            create(item);
        }
        
        return Result.success("批量创建成功", null);
    }

    @Operation(summary = "更新合同明细")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody ContractItem item) {
        log.info("更新合同明细, id={}", id);
        
        ContractItem existing = contractItemMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "合同明细不存在");
        }
        
        item.setId(id);
        
        // 重新计算总价
        if (item.getQuantity() != null && item.getUnitPrice() != null) {
            item.setTotalPrice(item.getQuantity().multiply(item.getUnitPrice()));
        }
        
        item.setUpdatedAt(LocalDateTime.now());
        contractItemMapper.updateById(item);
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除合同明细")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除合同明细, id={}", id);
        
        ContractItem existing = contractItemMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "合同明细不存在");
        }
        
        // 逻辑删除
        existing.setDelFlag(2);
        existing.setUpdatedAt(LocalDateTime.now());
        contractItemMapper.updateById(existing);
        
        return Result.success("删除成功", null);
    }
}
