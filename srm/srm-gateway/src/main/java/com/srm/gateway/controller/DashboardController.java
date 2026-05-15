package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.srm.gateway.entity.Contract;
import com.srm.gateway.entity.Material;
import com.srm.gateway.entity.Supplier;
import com.srm.gateway.mapper.ContractMapper;
import com.srm.gateway.mapper.MaterialMapper;
import com.srm.gateway.mapper.SupplierMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Tag(name = "数据统计", description = "Dashboard统计接口")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);
    private final SupplierMapper supplierMapper;
    private final MaterialMapper materialMapper;
    private final ContractMapper contractMapper;

    public DashboardController(SupplierMapper supplierMapper, MaterialMapper materialMapper, ContractMapper contractMapper) {
        this.supplierMapper = supplierMapper;
        this.materialMapper = materialMapper;
        this.contractMapper = contractMapper;
    }

    @Operation(summary = "获取统计数据")
    @GetMapping("/stats")
    public Result<Map<String, Object>> getStats() {
        log.info("获取Dashboard统计数据");
        
        Map<String, Object> stats = new HashMap<>();
        
        QueryWrapper<Supplier> supplierWrapper = new QueryWrapper<>();
        supplierWrapper.eq("del_flag", 0);
        long totalSuppliers = supplierMapper.selectCount(supplierWrapper);
        
        QueryWrapper<Supplier> qualifiedWrapper = new QueryWrapper<>();
        qualifiedWrapper.eq("del_flag", 0).eq("status", "QUALIFIED");
        long qualifiedSuppliers = supplierMapper.selectCount(qualifiedWrapper);
        
        QueryWrapper<Supplier> pendingWrapper = new QueryWrapper<>();
        pendingWrapper.eq("del_flag", 0).eq("status", "PENDING");
        long pendingSuppliers = supplierMapper.selectCount(pendingWrapper);
        
        QueryWrapper<Material> materialWrapper = new QueryWrapper<>();
        materialWrapper.eq("del_flag", 0).eq("status", "ACTIVE");
        long totalMaterials = materialMapper.selectCount(materialWrapper);
        
        QueryWrapper<Contract> activeContractWrapper = new QueryWrapper<>();
        activeContractWrapper.eq("del_flag", 0).eq("status", "EXECUTING");
        long activeContracts = contractMapper.selectCount(activeContractWrapper);
        
        QueryWrapper<Contract> draftContractWrapper = new QueryWrapper<>();
        draftContractWrapper.eq("del_flag", 0).eq("status", "DRAFT");
        long draftContracts = contractMapper.selectCount(draftContractWrapper);
        
        BigDecimal totalAmount = contractMapper.selectList(activeContractWrapper)
            .stream()
            .map(Contract::getAmount)
            .filter(a -> a != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalSuppliers", totalSuppliers);
        stats.put("qualifiedSuppliers", qualifiedSuppliers);
        stats.put("pendingSuppliers", pendingSuppliers);
        stats.put("totalMaterials", totalMaterials);
        stats.put("activeContracts", activeContracts);
        stats.put("draftContracts", draftContracts);
        stats.put("totalContractAmount", totalAmount);
        
        return Result.success("查询成功", stats);
    }
}
