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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
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
    
    private static final BigDecimal PRICE_INCREASE_THRESHOLD = new BigDecimal("5.00");
    private static final BigDecimal HUNDRED = new BigDecimal("100");

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
            map.put("taxRate", pricing.getTaxRate());
            map.put("priceWithTax", pricing.getPriceWithTax());
            map.put("currency", pricing.getCurrency());
            map.put("unit", pricing.getUnit());
            map.put("minOrderQty", pricing.getMinOrderQty());
            map.put("effectiveDate", pricing.getEffectiveDate());
            map.put("expiryDate", pricing.getExpiryDate());
            map.put("status", pricing.getStatus());
            map.put("remark", pricing.getRemark());
            map.put("priceChangeReason", pricing.getPriceChangeReason());
            map.put("priceChangeDetail", pricing.getPriceChangeDetail());
            map.put("priceIncreaseRate", pricing.getPriceIncreaseRate());
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
    public Result<Map<String, Object>> create(@RequestBody Pricing pricing) {
        log.info("创建定价, supplierId={}, materialId={}, price={}", 
            pricing.getSupplierId(), pricing.getMaterialId(), pricing.getPrice());
        
        if (pricing.getSupplierId() == null || pricing.getMaterialId() == null) {
            return Result.error(400, "供应商和物料不能为空");
        }
        
        if (pricing.getPrice() == null || pricing.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            return Result.error(400, "价格必须大于0");
        }
        
        if (pricing.getEffectiveDate() == null) {
            return Result.error(400, "生效日期不能为空");
        }
        
        Map<String, Object> validationResult = validatePriceOverlap(pricing, null);
        if (validationResult != null) {
            return Result.error(400, (String) validationResult.get("message"));
        }
        
        BigDecimal currentPrice = getCurrentEffectivePrice(pricing.getSupplierId(), pricing.getMaterialId());
        if (currentPrice != null && currentPrice.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal priceIncreaseRate = calculatePriceIncreaseRate(currentPrice, pricing.getPrice());
            if (priceIncreaseRate.compareTo(PRICE_INCREASE_THRESHOLD) > 0) {
                Map<String, Object> result = new HashMap<>();
                result.put("requiresReason", true);
                result.put("priceIncreaseRate", priceIncreaseRate);
                result.put("originalPrice", currentPrice);
                result.put("newPrice", pricing.getPrice());
                result.put("message", String.format("涨价幅度%.2f%%超过5%%阈值，请填写涨价原因", priceIncreaseRate));
                Result<Map<String, Object>> errorResult = Result.error(400, (String) result.get("message"));
                errorResult.setData(result);
                return errorResult;
            }
        }
        
        if (pricing.getCode() == null || pricing.getCode().isEmpty()) {
            pricing.setCode(generateCode());
        }
        
        if (pricing.getTaxRate() != null && pricing.getPrice() != null) {
            BigDecimal priceWithTax = pricing.getPrice().multiply(
                BigDecimal.ONE.add(pricing.getTaxRate().divide(HUNDRED, 4, RoundingMode.HALF_UP))
            ).setScale(2, RoundingMode.HALF_UP);
            pricing.setPriceWithTax(priceWithTax);
        }
        
        pricing.setStatus("PENDING");
        pricing.setDelFlag(0);
        pricing.setCreatedAt(LocalDateTime.now());
        pricing.setUpdatedAt(LocalDateTime.now());
        
        if (currentPrice != null && currentPrice.compareTo(BigDecimal.ZERO) > 0) {
            pricing.setOriginalPrice(currentPrice);
            BigDecimal rate = calculatePriceIncreaseRate(currentPrice, pricing.getPrice());
            pricing.setPriceIncreaseRate(rate);
        }
        
        pricingMapper.insert(pricing);
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", pricing.getId());
        result.put("code", pricing.getCode());
        result.put("requiresReason", false);
        
        return Result.success("创建成功", result);
    }

    @Operation(summary = "更新定价")
    @PutMapping("/{id}")
    public Result<Map<String, Object>> update(@PathVariable("id") Long id, @RequestBody Pricing pricing) {
        log.info("更新定价, id={}", id);
        
        Pricing existing = pricingMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "定价记录不存在");
        }
        
        if ("ACTIVE".equals(existing.getStatus()) || "EXPIRED".equals(existing.getStatus())) {
            return Result.error(400, "已生效或已过期的定价不能直接修改，请使用变更功能");
        }
        
        if (pricing.getPrice() != null && pricing.getPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal currentPrice = getCurrentEffectivePrice(existing.getSupplierId(), existing.getMaterialId(), id);
            if (currentPrice != null && currentPrice.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal priceIncreaseRate = calculatePriceIncreaseRate(currentPrice, pricing.getPrice());
                if (priceIncreaseRate.compareTo(PRICE_INCREASE_THRESHOLD) > 0) {
                    if (pricing.getPriceChangeReason() == null || pricing.getPriceChangeReason().isEmpty()) {
                        Map<String, Object> result = new HashMap<>();
                        result.put("requiresReason", true);
                        result.put("priceIncreaseRate", priceIncreaseRate);
                        result.put("originalPrice", currentPrice);
                        result.put("newPrice", pricing.getPrice());
                        result.put("message", String.format("涨价幅度%.2f%%超过5%%阈值，必须填写涨价原因", priceIncreaseRate));
                        Result<Map<String, Object>> errorResult = Result.error(400, (String) result.get("message"));
                        errorResult.setData(result);
                        return errorResult;
                    }
                }
            }
        }
        
        Map<String, Object> validationResult = validatePriceOverlap(pricing, id);
        if (validationResult != null) {
            return Result.error(400, (String) validationResult.get("message"));
        }
        
        if (pricing.getTaxRate() != null && pricing.getPrice() != null) {
            BigDecimal priceWithTax = pricing.getPrice().multiply(
                BigDecimal.ONE.add(pricing.getTaxRate().divide(HUNDRED, 4, RoundingMode.HALF_UP))
            ).setScale(2, RoundingMode.HALF_UP);
            pricing.setPriceWithTax(priceWithTax);
        }
        
        pricing.setId(id);
        pricing.setUpdatedAt(LocalDateTime.now());
        pricingMapper.updateById(pricing);
        
        Map<String, Object> result = new HashMap<>();
        result.put("requiresReason", false);
        return Result.success("更新成功", result);
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
    
    @Operation(summary = "获取当前生效价格")
    @GetMapping("/current-price")
    public Result<Map<String, Object>> getCurrentPrice(
            @RequestParam Long supplierId,
            @RequestParam Long materialId) {
        log.info("获取当前生效价格, supplierId={}, materialId={}", supplierId, materialId);
        
        BigDecimal currentPrice = getCurrentEffectivePrice(supplierId, materialId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("supplierId", supplierId);
        result.put("materialId", materialId);
        result.put("currentPrice", currentPrice);
        
        return Result.success("查询成功", result);
    }
    
    @Operation(summary = "检查价格重叠")
    @PostMapping("/check-overlap")
    public Result<Map<String, Object>> checkOverlap(@RequestBody Pricing pricing) {
        log.info("检查价格重叠, supplierId={}, materialId={}", pricing.getSupplierId(), pricing.getMaterialId());
        
        Map<String, Object> validationResult = validatePriceOverlap(pricing, null);
        
        Map<String, Object> result = new HashMap<>();
        if (validationResult != null) {
            result.put("hasOverlap", true);
            result.put("message", validationResult.get("message"));
        } else {
            result.put("hasOverlap", false);
            result.put("message", "无重叠时间段");
        }
        
        return Result.success("检查完成", result);
    }
    
    @Operation(summary = "检查涨价幅度")
    @PostMapping("/check-price-increase")
    public Result<Map<String, Object>> checkPriceIncrease(@RequestBody Pricing pricing) {
        log.info("检查涨价幅度, supplierId={}, materialId={}, newPrice={}", 
            pricing.getSupplierId(), pricing.getMaterialId(), pricing.getPrice());
        
        Map<String, Object> result = new HashMap<>();
        
        BigDecimal currentPrice = getCurrentEffectivePrice(pricing.getSupplierId(), pricing.getMaterialId());
        if (currentPrice == null || currentPrice.compareTo(BigDecimal.ZERO) <= 0) {
            result.put("hasCurrentPrice", false);
            result.put("requiresReason", false);
            return Result.success("当前无生效价格", result);
        }
        
        BigDecimal priceIncreaseRate = calculatePriceIncreaseRate(currentPrice, pricing.getPrice());
        result.put("hasCurrentPrice", true);
        result.put("originalPrice", currentPrice);
        result.put("newPrice", pricing.getPrice());
        result.put("priceIncreaseRate", priceIncreaseRate);
        result.put("requiresReason", priceIncreaseRate.compareTo(PRICE_INCREASE_THRESHOLD) > 0);
        
        if (result.get("requiresReason").equals(true)) {
            result.put("message", String.format("涨价幅度%.2f%%超过5%%阈值，必须填写涨价原因", priceIncreaseRate));
        } else {
            result.put("message", "涨价幅度在允许范围内");
        }
        
        return Result.success("检查完成", result);
    }

    private Map<String, Object> validatePriceOverlap(Pricing newPricing, Long excludeId) {
        if (newPricing.getSupplierId() == null || newPricing.getMaterialId() == null) {
            return null;
        }
        
        QueryWrapper<Pricing> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", newPricing.getSupplierId())
               .eq("material_id", newPricing.getMaterialId())
               .eq("status", "ACTIVE")
               .eq("del_flag", 0);
        
        if (excludeId != null) {
            wrapper.ne("id", excludeId);
        }
        
        List<Pricing> activePricings = pricingMapper.selectList(wrapper);
        
        LocalDate newStart = newPricing.getEffectiveDate();
        LocalDate newEnd = newPricing.getExpiryDate();
        
        for (Pricing existing : activePricings) {
            LocalDate existStart = existing.getEffectiveDate();
            LocalDate existEnd = existing.getExpiryDate();
            
            if (existEnd == null) {
                existEnd = LocalDate.of(2099, 12, 31);
            }
            
            if (newStart.isAfter(existEnd) || newEnd.isBefore(existStart)) {
                continue;
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("message", String.format("存在时间段重叠的已生效定价（%s - %s），请先终止或调整现有定价", 
                existStart, existEnd));
            return result;
        }
        
        return null;
    }
    
    private BigDecimal getCurrentEffectivePrice(Long supplierId, Long materialId) {
        return getCurrentEffectivePrice(supplierId, materialId, null);
    }
    
    private BigDecimal getCurrentEffectivePrice(Long supplierId, Long materialId, Long excludeId) {
        QueryWrapper<Pricing> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId)
               .eq("material_id", materialId)
               .eq("status", "ACTIVE")
               .eq("del_flag", 0);
        
        if (excludeId != null) {
            wrapper.ne("id", excludeId);
        }
        
        List<Pricing> activePricings = pricingMapper.selectList(wrapper);
        
        LocalDate today = LocalDate.now();
        for (Pricing pricing : activePricings) {
            LocalDate start = pricing.getEffectiveDate();
            LocalDate end = pricing.getExpiryDate();
            
            if (end == null) {
                end = LocalDate.of(2099, 12, 31);
            }
            
            if (!today.isBefore(start) && !today.isAfter(end)) {
                return pricing.getPrice();
            }
        }
        
        wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId)
               .eq("material_id", materialId)
               .eq("del_flag", 0);
        
        if (excludeId != null) {
            wrapper.ne("id", excludeId);
        }
        
        wrapper.orderByDesc("effective_date");
        List<Pricing> allPricings = pricingMapper.selectList(wrapper);
        
        if (!allPricings.isEmpty()) {
            return allPricings.get(0).getPrice();
        }
        
        return null;
    }
    
    private BigDecimal calculatePriceIncreaseRate(BigDecimal originalPrice, BigDecimal newPrice) {
        if (originalPrice == null || originalPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        if (newPrice == null || newPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        return newPrice.subtract(originalPrice)
                       .divide(originalPrice, 4, RoundingMode.HALF_UP)
                       .multiply(HUNDRED)
                       .setScale(2, RoundingMode.HALF_UP);
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
