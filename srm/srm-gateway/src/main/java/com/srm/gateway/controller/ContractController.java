package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.entity.Contract;
import com.srm.gateway.entity.ContractItem;
import com.srm.gateway.entity.Supplier;
import com.srm.gateway.entity.Material;
import com.srm.gateway.mapper.ContractMapper;
import com.srm.gateway.mapper.ContractItemMapper;
import com.srm.gateway.mapper.SupplierMapper;
import com.srm.gateway.mapper.MaterialMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "合同管理", description = "合同相关接口")
@RestController
@RequestMapping("/api/contracts")
public class ContractController {
    private static final Logger log = LoggerFactory.getLogger(ContractController.class);
    private final ContractMapper contractMapper;
    private final ContractItemMapper contractItemMapper;
    private final SupplierMapper supplierMapper;
    private final MaterialMapper materialMapper;

    public ContractController(ContractMapper contractMapper,
                             ContractItemMapper contractItemMapper,
                             SupplierMapper supplierMapper,
                             MaterialMapper materialMapper) {
        this.contractMapper = contractMapper;
        this.contractItemMapper = contractItemMapper;
        this.supplierMapper = supplierMapper;
        this.materialMapper = materialMapper;
    }

    @Operation(summary = "获取合同列表")
    @GetMapping
    public Result<PageResult<Map<String, Object>>> getList(
            @RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "supplierId", required = false) Long supplierId) {
        log.info("获取合同列表, page={}, pageSize={}, keyword={}, type={}, status={}", page, pageSize, keyword, type, status);
        
        Page<Contract> pageParam = new Page<>(page, pageSize);
        QueryWrapper<Contract> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0);
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("code", keyword).or().like("name", keyword));
        }
        
        if (type != null && !type.isEmpty()) {
            wrapper.eq("type", type);
        }
        
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }
        
        if (supplierId != null && supplierId > 0) {
            wrapper.eq("supplier_id", supplierId);
        }
        
        wrapper.orderByDesc("created_at");
        IPage<Contract> result = contractMapper.selectPage(pageParam, wrapper);
        
        List<Map<String, Object>> enrichedList = result.getRecords().stream().map(contract -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", contract.getId());
            map.put("code", contract.getCode());
            map.put("name", contract.getName());
            map.put("type", contract.getType());
            map.put("status", contract.getStatus());
            map.put("amount", contract.getAmount());
            map.put("currency", contract.getCurrency());
            map.put("startDate", contract.getStartDate());
            map.put("endDate", contract.getEndDate());
            map.put("createdAt", contract.getCreatedAt());
            
            if (contract.getSupplierId() != null) {
                Supplier supplier = supplierMapper.selectById(contract.getSupplierId());
                map.put("supplierId", contract.getSupplierId());
                map.put("supplierName", supplier != null ? supplier.getName() : "");
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

    @Operation(summary = "获取合同详情")
    @GetMapping("/{id}")
    public Result<Map<String, Object>> getById(@PathVariable("id") Long id) {
        log.info("获取合同详情, id={}", id);
        Contract contract = contractMapper.selectById(id);
        if (contract == null || contract.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", contract.getId());
        result.put("code", contract.getCode());
        result.put("name", contract.getName());
        result.put("type", contract.getType());
        result.put("status", contract.getStatus());
        result.put("amount", contract.getAmount());
        result.put("currency", contract.getCurrency());
        result.put("startDate", contract.getStartDate());
        result.put("endDate", contract.getEndDate());
        result.put("content", contract.getContent());
        result.put("paymentTerms", contract.getPaymentTerms());
        result.put("attachmentUrl", contract.getAttachmentUrl());
        result.put("createdAt", contract.getCreatedAt());
        result.put("updatedAt", contract.getUpdatedAt());
        
        if (contract.getSupplierId() != null) {
            Supplier supplier = supplierMapper.selectById(contract.getSupplierId());
            result.put("supplierId", contract.getSupplierId());
            result.put("supplierName", supplier != null ? supplier.getName() : "");
            result.put("supplierCode", supplier != null ? supplier.getCode() : "");
        }
        
        if ("NDA".equals(contract.getType()) || "NDA保密协议".equals(contract.getType())) {
            result.put("confidentialityScope", contract.getConfidentialityScope());
            result.put("confidentialityPeriod", contract.getConfidentialityPeriod());
            result.put("confidentialityObligations", contract.getConfidentialityObligations());
            result.put("liabilityForBreach", contract.getLiabilityForBreach());
            result.put("disputeResolution", contract.getDisputeResolution());
            result.put("governingLaw", contract.getGoverningLaw());
        } else {
            result.put("purchaseOrderNo", contract.getPurchaseOrderNo());
            result.put("warehouse", contract.getWarehouse());
            result.put("deliveryAddress", contract.getDeliveryAddress());
            result.put("deliveryMethod", contract.getDeliveryMethod());
            result.put("qualityRequirements", contract.getQualityRequirements());
            result.put("acceptanceCriterium", contract.getAcceptanceCriteria());
            result.put("warrantyPeriod", contract.getWarrantyPeriod());
            result.put("penaltyRate", contract.getPenaltyRate());
        }
        
        if ("委托加工".equals(contract.getType()) || "委托加工合同".equals(contract.getType())) {
            result.put("drawingNo", contract.getDrawingNo());
            result.put("drawingVersion", contract.getDrawingVersion());
            result.put("processingRequirements", contract.getProcessingRequirements());
            result.put("materialRequirements", contract.getMaterialRequirements());
            result.put("qualityMonitoring", contract.getQualityMonitoring());
            result.put("intellectualProperty", contract.getIntellectualProperty());
        }
        
        QueryWrapper<ContractItem> itemWrapper = new QueryWrapper<>();
        itemWrapper.eq("contract_id", id).eq("del_flag", 0).orderByAsc("sort_order");
        List<ContractItem> items = contractItemMapper.selectList(itemWrapper);
        result.put("items", items);
        
        return Result.success("查询成功", result);
    }

    @Operation(summary = "创建合同")
    @PostMapping
    public Result<Long> create(@RequestBody Map<String, Object> requestData) {
        log.info("创建合同, name={}, type={}", requestData.get("name"), requestData.get("type"));
        
        Contract contract = new Contract();
        contract.setName((String) requestData.get("name"));
        contract.setType((String) requestData.get("type"));
        
        Object supplierId = requestData.get("supplierId");
        if (supplierId != null) {
            contract.setSupplierId(Long.valueOf(supplierId.toString()));
        }
        
        Object startDate = requestData.get("startDate");
        if (startDate != null) {
            contract.setStartDate(LocalDate.parse(startDate.toString()));
        }
        
        Object endDate = requestData.get("endDate");
        if (endDate != null) {
            contract.setEndDate(LocalDate.parse(endDate.toString()));
        }
        
        contract.setCurrency((String) requestData.getOrDefault("currency", "CNY"));
        contract.setPaymentTerms((String) requestData.get("paymentTerms"));
        contract.setConfidentialityScope((String) requestData.get("confidentialityScope"));
        
        Object confidentialityPeriod = requestData.get("confidentialityPeriod");
        if (confidentialityPeriod != null) {
            contract.setConfidentialityPeriod(Integer.valueOf(confidentialityPeriod.toString()));
        }
        
        contract.setConfidentialityObligations((String) requestData.get("confidentialityObligations"));
        contract.setLiabilityForBreach((String) requestData.get("liabilityForBreach"));
        contract.setDisputeResolution((String) requestData.get("disputeResolution"));
        contract.setGoverningLaw((String) requestData.getOrDefault("governingLaw", "中国"));
        contract.setPurchaseOrderNo((String) requestData.get("purchaseOrderNo"));
        contract.setWarehouse((String) requestData.get("warehouse"));
        contract.setDeliveryAddress((String) requestData.get("deliveryAddress"));
        contract.setDeliveryMethod((String) requestData.get("deliveryMethod"));
        contract.setQualityRequirements((String) requestData.get("qualityRequirements"));
        contract.setAcceptanceCriteria((String) requestData.get("acceptanceCriterium"));
        
        Object warrantyPeriod = requestData.get("warrantyPeriod");
        if (warrantyPeriod != null) {
            contract.setWarrantyPeriod(Integer.valueOf(warrantyPeriod.toString()));
        }
        
        Object penaltyRate = requestData.get("penaltyRate");
        if (penaltyRate != null) {
            contract.setPenaltyRate(new BigDecimal(penaltyRate.toString()));
        }
        
        contract.setDrawingNo((String) requestData.get("drawingNo"));
        contract.setDrawingVersion((String) requestData.get("drawingVersion"));
        contract.setProcessingRequirements((String) requestData.get("processingRequirements"));
        contract.setMaterialRequirements((String) requestData.get("materialRequirements"));
        contract.setQualityMonitoring((String) requestData.get("qualityMonitoring"));
        contract.setIntellectualProperty((String) requestData.get("intellectualProperty"));
        
        if (contract.getCode() == null || contract.getCode().isEmpty()) {
            contract.setCode(generateContractCode());
        }
        
        contract.setStatus("DRAFT");
        contract.setDelFlag(0);
        contract.setCreatedAt(LocalDateTime.now());
        contract.setUpdatedAt(LocalDateTime.now());
        
        contractMapper.insert(contract);
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) requestData.get("items");
        if (items != null && !items.isEmpty()) {
            BigDecimal totalAmount = BigDecimal.ZERO;
            for (Map<String, Object> itemData : items) {
                ContractItem item = new ContractItem();
                item.setContractId(contract.getId());
                
                Object itemMaterialId = itemData.get("materialId");
                if (itemMaterialId != null) {
                    item.setMaterialId(Long.valueOf(itemMaterialId.toString()));
                }
                
                item.setMaterialCode((String) itemData.get("materialCode"));
                item.setMaterialName((String) itemData.get("materialName"));
                item.setMaterialSpec((String) itemData.get("materialSpec"));
                item.setMaterialModel((String) itemData.get("materialModel"));
                
                Object quantity = itemData.get("quantity");
                if (quantity != null) {
                    item.setQuantity(new BigDecimal(quantity.toString()));
                }
                
                item.setUnit((String) itemData.get("unit"));
                
                Object unitPrice = itemData.get("unitPrice");
                if (unitPrice != null) {
                    item.setUnitPrice(new BigDecimal(unitPrice.toString()));
                }
                
                Object taxRate = itemData.get("taxRate");
                if (taxRate != null) {
                    item.setTaxRate(new BigDecimal(taxRate.toString()));
                }
                
                Object deliveryDate = itemData.get("deliveryDate");
                if (deliveryDate != null) {
                    item.setDeliveryDate(LocalDate.parse(deliveryDate.toString()));
                }
                
                item.setRemark((String) itemData.get("remark"));
                item.setDelFlag(0);
                item.setCreatedAt(LocalDateTime.now());
                item.setUpdatedAt(LocalDateTime.now());
                item.setSnapshotTime(LocalDateTime.now());
                
                calculateItemPrices(item);
                contractItemMapper.insert(item);
                
                if (item.getTotalPriceWithTax() != null) {
                    totalAmount = totalAmount.add(item.getTotalPriceWithTax());
                }
            }
            
            if (totalAmount.compareTo(BigDecimal.ZERO) > 0) {
                contract.setAmount(totalAmount);
                contractMapper.updateById(contract);
            }
        }
        
        return Result.success("创建成功", contract.getId());
    }

    @Operation(summary = "更新合同")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody Map<String, Object> requestData) {
        log.info("更新合同, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        if ("PENDING".equals(existing.getStatus()) || "APPROVED".equals(existing.getStatus()) || 
            "SIGNED".equals(existing.getStatus()) || "EXECUTING".equals(existing.getStatus()) ||
            "COMPLETED".equals(existing.getStatus())) {
            return Result.error(400, "审批中或已生效的合同不能直接修改");
        }
        
        Contract contract = new Contract();
        contract.setId(id);
        contract.setName((String) requestData.get("name"));
        contract.setType((String) requestData.get("type"));
        
        Object supplierId = requestData.get("supplierId");
        if (supplierId != null) {
            contract.setSupplierId(Long.valueOf(supplierId.toString()));
        }
        
        Object startDate = requestData.get("startDate");
        if (startDate != null) {
            contract.setStartDate(LocalDate.parse(startDate.toString()));
        }
        
        Object endDate = requestData.get("endDate");
        if (endDate != null) {
            contract.setEndDate(LocalDate.parse(endDate.toString()));
        }
        
        contract.setCurrency((String) requestData.getOrDefault("currency", "CNY"));
        contract.setPaymentTerms((String) requestData.get("paymentTerms"));
        contract.setConfidentialityScope((String) requestData.get("confidentialityScope"));
        
        Object confidentialityPeriod = requestData.get("confidentialityPeriod");
        if (confidentialityPeriod != null) {
            contract.setConfidentialityPeriod(Integer.valueOf(confidentialityPeriod.toString()));
        }
        
        contract.setConfidentialityObligations((String) requestData.get("confidentialityObligations"));
        contract.setLiabilityForBreach((String) requestData.get("liabilityForBreach"));
        contract.setDisputeResolution((String) requestData.get("disputeResolution"));
        contract.setGoverningLaw((String) requestData.get("governingLaw"));
        contract.setPurchaseOrderNo((String) requestData.get("purchaseOrderNo"));
        contract.setWarehouse((String) requestData.get("warehouse"));
        contract.setDeliveryAddress((String) requestData.get("deliveryAddress"));
        contract.setDeliveryMethod((String) requestData.get("deliveryMethod"));
        contract.setQualityRequirements((String) requestData.get("qualityRequirements"));
        contract.setAcceptanceCriteria((String) requestData.get("acceptanceCriterium"));
        
        Object warrantyPeriod = requestData.get("warrantyPeriod");
        if (warrantyPeriod != null) {
            contract.setWarrantyPeriod(Integer.valueOf(warrantyPeriod.toString()));
        }
        
        Object penaltyRate = requestData.get("penaltyRate");
        if (penaltyRate != null) {
            contract.setPenaltyRate(new BigDecimal(penaltyRate.toString()));
        }
        
        contract.setDrawingNo((String) requestData.get("drawingNo"));
        contract.setDrawingVersion((String) requestData.get("drawingVersion"));
        contract.setProcessingRequirements((String) requestData.get("processingRequirements"));
        contract.setMaterialRequirements((String) requestData.get("materialRequirements"));
        contract.setQualityMonitoring((String) requestData.get("qualityMonitoring"));
        contract.setIntellectualProperty((String) requestData.get("intellectualProperty"));
        contract.setUpdatedAt(LocalDateTime.now());
        
        contractMapper.updateById(contract);
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) requestData.get("items");
        if (items != null) {
            UpdateWrapper<ContractItem> delWrapper = new UpdateWrapper<>();
            delWrapper.eq("contract_id", id);
            delWrapper.set("del_flag", 2);
            contractItemMapper.update(null, delWrapper);
            
            BigDecimal totalAmount = BigDecimal.ZERO;
            for (Map<String, Object> itemData : items) {
                ContractItem item = new ContractItem();
                item.setContractId(id);
                
                Object itemId = itemData.get("id");
                if (itemId != null) {
                    item.setId(Long.valueOf(itemId.toString()));
                }
                
                Object itemMaterialId = itemData.get("materialId");
                if (itemMaterialId != null) {
                    item.setMaterialId(Long.valueOf(itemMaterialId.toString()));
                }
                
                item.setMaterialCode((String) itemData.get("materialCode"));
                item.setMaterialName((String) itemData.get("materialName"));
                item.setMaterialSpec((String) itemData.get("materialSpec"));
                item.setMaterialModel((String) itemData.get("materialModel"));
                
                Object quantity = itemData.get("quantity");
                if (quantity != null) {
                    item.setQuantity(new BigDecimal(quantity.toString()));
                }
                
                item.setUnit((String) itemData.get("unit"));
                
                Object unitPrice = itemData.get("unitPrice");
                if (unitPrice != null) {
                    item.setUnitPrice(new BigDecimal(unitPrice.toString()));
                }
                
                Object taxRate = itemData.get("taxRate");
                if (taxRate != null) {
                    item.setTaxRate(new BigDecimal(taxRate.toString()));
                }
                
                Object deliveryDate = itemData.get("deliveryDate");
                if (deliveryDate != null) {
                    item.setDeliveryDate(LocalDate.parse(deliveryDate.toString()));
                }
                
                item.setRemark((String) itemData.get("remark"));
                item.setDelFlag(0);
                item.setCreatedAt(LocalDateTime.now());
                item.setUpdatedAt(LocalDateTime.now());
                item.setSnapshotTime(LocalDateTime.now());
                
                calculateItemPrices(item);
                
                if (item.getId() != null) {
                    contractItemMapper.updateById(item);
                } else {
                    contractItemMapper.insert(item);
                }
                
                if (item.getTotalPriceWithTax() != null) {
                    totalAmount = totalAmount.add(item.getTotalPriceWithTax());
                }
            }
            
            if (totalAmount.compareTo(BigDecimal.ZERO) > 0) {
                contract.setAmount(totalAmount);
                contractMapper.updateById(contract);
            }
        }
        
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除合同")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除合同, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        UpdateWrapper<Contract> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("del_flag", 2);
        wrapper.set("updated_at", LocalDateTime.now());
        contractMapper.update(null, wrapper);
        
        UpdateWrapper<ContractItem> itemWrapper = new UpdateWrapper<>();
        itemWrapper.eq("contract_id", id);
        itemWrapper.set("del_flag", 2);
        contractItemMapper.update(null, itemWrapper);
        
        return Result.success("删除成功", null);
    }

    @Operation(summary = "提交审批")
    @PostMapping("/{id}/submit")
    public Result<Void> submit(@PathVariable("id") Long id) {
        log.info("提交审批, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        if (!"DRAFT".equals(existing.getStatus())) {
            return Result.error(400, "只有草稿状态的合同可以提交审批");
        }
        
        UpdateWrapper<Contract> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", "PENDING");
        wrapper.set("updated_at", LocalDateTime.now());
        contractMapper.update(null, wrapper);
        
        return Result.success("提交成功", null);
    }

    @Operation(summary = "审批通过")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable("id") Long id) {
        log.info("审批通过, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        if (!"PENDING".equals(existing.getStatus())) {
            return Result.error(400, "只有审批中的合同可以审批");
        }
        
        UpdateWrapper<Contract> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", "APPROVED");
        wrapper.set("updated_at", LocalDateTime.now());
        contractMapper.update(null, wrapper);
        
        return Result.success("审批通过", null);
    }

    @Operation(summary = "审批拒绝")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable("id") Long id, @RequestBody Map<String, String> params) {
        log.info("审批拒绝, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        if (!"PENDING".equals(existing.getStatus())) {
            return Result.error(400, "只有审批中的合同可以拒绝");
        }
        
        UpdateWrapper<Contract> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", "REJECTED");
        wrapper.set("updated_at", LocalDateTime.now());
        contractMapper.update(null, wrapper);
        
        return Result.success("审批拒绝", null);
    }

    @Operation(summary = "签署完成")
    @PostMapping("/{id}/sign")
    public Result<Void> sign(@PathVariable("id") Long id) {
        log.info("签署完成, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        if (!"APPROVED".equals(existing.getStatus())) {
            return Result.error(400, "只有已批准的合同可以签署");
        }
        
        UpdateWrapper<Contract> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", "SIGNED");
        wrapper.set("updated_at", LocalDateTime.now());
        contractMapper.update(null, wrapper);
        
        return Result.success("签署完成", null);
    }

    @Operation(summary = "合同生效")
    @PostMapping("/{id}/activate")
    public Result<Void> activate(@PathVariable("id") Long id) {
        log.info("合同生效, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        if (!"SIGNED".equals(existing.getStatus())) {
            return Result.error(400, "只有签署完成的合同可以生效");
        }
        
        UpdateWrapper<Contract> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", "ACTIVE");
        wrapper.set("updated_at", LocalDateTime.now());
        contractMapper.update(null, wrapper);
        
        return Result.success("合同已生效", null);
    }

    @Operation(summary = "合同开始执行")
    @PostMapping("/{id}/start-execute")
    public Result<Void> startExecute(@PathVariable("id") Long id) {
        log.info("合同开始执行, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        if (!"ACTIVE".equals(existing.getStatus())) {
            return Result.error(400, "只有已生效的合同可以开始执行");
        }
        
        UpdateWrapper<Contract> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", "EXECUTING");
        wrapper.set("updated_at", LocalDateTime.now());
        contractMapper.update(null, wrapper);
        
        return Result.success("合同开始执行", null);
    }

    @Operation(summary = "合同完成")
    @PostMapping("/{id}/complete")
    public Result<Void> complete(@PathVariable("id") Long id) {
        log.info("合同完成, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        if (!"EXECUTING".equals(existing.getStatus())) {
            return Result.error(400, "只有执行中的合同可以完成");
        }
        
        UpdateWrapper<Contract> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", "COMPLETED");
        wrapper.set("updated_at", LocalDateTime.now());
        contractMapper.update(null, wrapper);
        
        return Result.success("合同已完成", null);
    }

    @Operation(summary = "合同终止")
    @PostMapping("/{id}/terminate")
    public Result<Void> terminate(@PathVariable("id") Long id, @RequestBody(required = false) Map<String, String> params) {
        log.info("合同终止, id={}", id);
        
        Contract existing = contractMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        if ("COMPLETED".equals(existing.getStatus()) || "TERMINATED".equals(existing.getStatus()) || "EXPIRED".equals(existing.getStatus())) {
            return Result.error(400, "该合同状态不允许终止");
        }
        
        UpdateWrapper<Contract> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", "TERMINATED");
        wrapper.set("updated_at", LocalDateTime.now());
        contractMapper.update(null, wrapper);
        
        return Result.success("合同已终止", null);
    }

    @Operation(summary = "获取活跃供应商列表")
    @GetMapping("/suppliers")
    public Result<List<Supplier>> getActiveSuppliers() {
        QueryWrapper<Supplier> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "QUALIFIED").eq("del_flag", 0);
        wrapper.orderByAsc("name");
        return Result.success("查询成功", supplierMapper.selectList(wrapper));
    }

    @Operation(summary = "获取活跃物料列表")
    @GetMapping("/materials")
    public Result<List<Material>> getActiveMaterials() {
        QueryWrapper<Material> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "ACTIVE").eq("del_flag", 0);
        wrapper.orderByAsc("name");
        return Result.success("查询成功", materialMapper.selectList(wrapper));
    }

    @Operation(summary = "获取合同明细")
    @GetMapping("/{id}/items")
    public Result<List<ContractItem>> getItems(@PathVariable("id") Long id) {
        log.info("获取合同明细, contractId={}", id);
        QueryWrapper<ContractItem> wrapper = new QueryWrapper<>();
        wrapper.eq("contract_id", id).eq("del_flag", 0).orderByAsc("sort_order");
        List<ContractItem> items = contractItemMapper.selectList(wrapper);
        return Result.success("查询成功", items);
    }

    @Operation(summary = "添加合同明细")
    @PostMapping("/{id}/items")
    public Result<Long> addItem(@PathVariable("id") Long id, @RequestBody ContractItem item) {
        log.info("添加合同明细, contractId={}", id);
        
        Contract contract = contractMapper.selectById(id);
        if (contract == null || contract.getDelFlag() == 2) {
            return Result.error(404, "合同不存在");
        }
        
        item.setContractId(id);
        item.setDelFlag(0);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        item.setSnapshotTime(LocalDateTime.now());
        
        if (item.getMaterialId() != null) {
            Material material = materialMapper.selectById(item.getMaterialId());
            if (material != null) {
                item.setMaterialCode(material.getCode());
                item.setMaterialName(material.getName());
                item.setMaterialSpec(material.getSpecification());
                item.setMaterialModel(material.getModel());
                item.setSnapshotName(material.getName());
                item.setSnapshotModel(material.getModel());
            }
        }
        
        calculateItemPrices(item);
        contractItemMapper.insert(item);
        
        recalculateContractAmount(id);
        
        return Result.success("添加成功", item.getId());
    }

    @Operation(summary = "更新合同明细")
    @PutMapping("/{contractId}/items/{itemId}")
    public Result<Void> updateItem(
            @PathVariable("contractId") Long contractId,
            @PathVariable("itemId") Long itemId,
            @RequestBody ContractItem item) {
        log.info("更新合同明细, contractId={}, itemId={}", contractId, itemId);
        
        item.setId(itemId);
        item.setUpdatedAt(LocalDateTime.now());
        item.setSnapshotTime(LocalDateTime.now());
        
        calculateItemPrices(item);
        contractItemMapper.updateById(item);
        
        recalculateContractAmount(contractId);
        
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除合同明细")
    @DeleteMapping("/{contractId}/items/{itemId}")
    public Result<Void> deleteItem(
            @PathVariable("contractId") Long contractId,
            @PathVariable("itemId") Long itemId) {
        log.info("删除合同明细, contractId={}, itemId={}", contractId, itemId);
        
        UpdateWrapper<ContractItem> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", itemId);
        wrapper.set("del_flag", 2);
        wrapper.set("updated_at", LocalDateTime.now());
        contractItemMapper.update(null, wrapper);
        
        recalculateContractAmount(contractId);
        
        return Result.success("删除成功", null);
    }

    private String generateContractCode() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "CON" + dateStr + "%";
        String maxCode = contractMapper.selectMaxCode(prefix);
        
        int nextNum = 1;
        if (maxCode != null && maxCode.length() >= 16) {
            String numPart = maxCode.substring(maxCode.length() - 4);
            try {
                nextNum = Integer.parseInt(numPart) + 1;
            } catch (NumberFormatException e) {
                nextNum = 1;
            }
        }
        
        return "CON" + dateStr + String.format("%04d", nextNum);
    }

    private void calculateItemPrices(ContractItem item) {
        if (item.getQuantity() != null && item.getUnitPrice() != null) {
            BigDecimal quantity = item.getQuantity();
            BigDecimal unitPrice = item.getUnitPrice();
            
            BigDecimal totalPrice = quantity.multiply(unitPrice).setScale(2, RoundingMode.HALF_UP);
            item.setTotalPrice(totalPrice);
            
            BigDecimal taxRate = item.getTaxRate();
            if (taxRate == null) {
                taxRate = new BigDecimal("13.00");
            }
            
            BigDecimal priceWithTax = unitPrice.multiply(
                BigDecimal.ONE.add(taxRate.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP))
            ).setScale(2, RoundingMode.HALF_UP);
            item.setPriceWithTax(priceWithTax);
            
            BigDecimal totalPriceWithTax = quantity.multiply(priceWithTax).setScale(2, RoundingMode.HALF_UP);
            item.setTotalPriceWithTax(totalPriceWithTax);
        }
    }

    private void recalculateContractAmount(Long contractId) {
        QueryWrapper<ContractItem> wrapper = new QueryWrapper<>();
        wrapper.eq("contract_id", contractId).eq("del_flag", 0);
        List<ContractItem> items = contractItemMapper.selectList(wrapper);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (ContractItem item : items) {
            if (item.getTotalPriceWithTax() != null) {
                totalAmount = totalAmount.add(item.getTotalPriceWithTax());
            }
        }
        
        Contract contract = contractMapper.selectById(contractId);
        if (contract != null && totalAmount.compareTo(BigDecimal.ZERO) > 0) {
            contract.setAmount(totalAmount);
            contract.setUpdatedAt(LocalDateTime.now());
            contractMapper.updateById(contract);
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
