package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.entity.Logistics;
import com.srm.gateway.mapper.LogisticsMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Tag(name = "物流管理", description = "物流相关接口")
@RestController
@RequestMapping("/api/logistics")
public class LogisticsController {
    private static final Logger log = LoggerFactory.getLogger(LogisticsController.class);
    private final LogisticsMapper logisticsMapper;

    public LogisticsController(LogisticsMapper logisticsMapper) {
        this.logisticsMapper = logisticsMapper;
    }

    @Operation(summary = "获取物流列表")
    @GetMapping
    public Result<PageResult<Logistics>> getList(
            @RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "contractId", required = false) Long contractId) {
        log.info("获取物流列表, page={}, pageSize={}, keyword={}, status={}, contractId={}", page, pageSize, keyword, status, contractId);
        
        Page<Logistics> pageParam = new Page<>(page, pageSize);
        QueryWrapper<Logistics> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0);
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("code", keyword).or().like("logistics_no", keyword).or().like("contract_code", keyword));
        }
        
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }
        
        if (contractId != null && contractId > 0) {
            wrapper.eq("contract_id", contractId);
        }
        
        wrapper.orderByDesc("created_at");
        IPage<Logistics> result = logisticsMapper.selectPage(pageParam, wrapper);
        
        PageResult<Logistics> pageResult = new PageResult<>();
        pageResult.setList(result.getRecords());
        pageResult.setTotal(result.getTotal());
        pageResult.setPage(page);
        pageResult.setPageSize(pageSize);
        
        return Result.success("查询成功", pageResult);
    }

    @Operation(summary = "获取物流详情")
    @GetMapping("/{id}")
    public Result<Logistics> getById(@PathVariable("id") Long id) {
        log.info("获取物流详情, id={}", id);
        Logistics logistics = logisticsMapper.selectById(id);
        if (logistics == null || logistics.getDelFlag() == 2) {
            return Result.error(404, "物流记录不存在");
        }
        return Result.success("查询成功", logistics);
    }

    @Operation(summary = "根据合同ID获取物流列表")
    @GetMapping("/contract/{contractId}")
    public Result<List<Logistics>> getByContractId(@PathVariable("contractId") Long contractId) {
        log.info("根据合同ID获取物流列表, contractId={}", contractId);
        List<Logistics> list = logisticsMapper.selectByContractId(contractId);
        return Result.success("查询成功", list);
    }

    @Operation(summary = "创建物流记录")
    @PostMapping
    public Result<Long> create(@RequestBody Logistics logistics) {
        log.info("创建物流记录, contractId={}", logistics.getContractId());
        
        logistics.setStatus("PENDING");
        logistics.setDelFlag(0);
        logistics.setCreatedAt(LocalDateTime.now());
        logistics.setUpdatedAt(LocalDateTime.now());
        
        String code = generateLogisticsCode();
        logistics.setCode(code);
        
        logisticsMapper.insert(logistics);
        return Result.success("创建成功", logistics.getId());
    }

    @Operation(summary = "更新物流记录")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody Logistics logistics) {
        log.info("更新物流记录, id={}", id);
        
        Logistics existing = logisticsMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "物流记录不存在");
        }
        
        logistics.setId(id);
        logistics.setUpdatedAt(LocalDateTime.now());
        logisticsMapper.updateById(logistics);
        return Result.success("更新成功", null);
    }

    @Operation(summary = "发货确认")
    @PostMapping("/{id}/ship")
    public Result<Void> ship(@PathVariable("id") Long id, @RequestBody Logistics logistics) {
        log.info("发货确认, id={}", id);
        
        Logistics existing = logisticsMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "物流记录不存在");
        }
        
        if (!"PENDING".equals(existing.getStatus())) {
            return Result.error(400, "只有待发货状态的物流记录才能确认发货");
        }
        
        UpdateWrapper<Logistics> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", "SHIPPED");
        wrapper.set("actual_delivery_date", LocalDate.now());
        wrapper.set("logistics_no", logistics.getLogisticsNo());
        wrapper.set("logistics_company", logistics.getLogisticsCompany());
        wrapper.set("current_location", logistics.getCurrentLocation());
        wrapper.set("updated_at", LocalDateTime.now());
        
        logisticsMapper.update(null, wrapper);
        return Result.success("发货确认成功", null);
    }

    @Operation(summary = "到货确认")
    @PostMapping("/{id}/arrive")
    public Result<Void> arrive(@PathVariable("id") Long id) {
        log.info("到货确认, id={}", id);
        
        Logistics existing = logisticsMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "物流记录不存在");
        }
        
        if (!"SHIPPED".equals(existing.getStatus())) {
            return Result.error(400, "只有已发货状态的物流记录才能确认到货");
        }
        
        UpdateWrapper<Logistics> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", "ARRIVED");
        wrapper.set("actual_arrival_date", LocalDate.now());
        wrapper.set("current_location", "已到达目的地");
        wrapper.set("updated_at", LocalDateTime.now());
        
        logisticsMapper.update(null, wrapper);
        return Result.success("到货确认成功", null);
    }

    @Operation(summary = "更新物流状态")
    @PostMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable("id") Long id, @RequestBody Map<String, String> params) {
        log.info("更新物流状态, id={}", id);
        
        Logistics existing = logisticsMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "物流记录不存在");
        }
        
        String status = params.get("status");
        String currentLocation = params.get("currentLocation");
        String trackingInfo = params.get("trackingInfo");
        
        if (status == null || status.isEmpty()) {
            return Result.error(400, "状态不能为空");
        }
        
        UpdateWrapper<Logistics> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("status", status);
        if (currentLocation != null) {
            wrapper.set("current_location", currentLocation);
        }
        if (trackingInfo != null) {
            wrapper.set("tracking_info", trackingInfo);
        }
        wrapper.set("updated_at", LocalDateTime.now());
        
        logisticsMapper.update(null, wrapper);
        return Result.success("状态更新成功", null);
    }

    @Operation(summary = "删除物流记录")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除物流记录, id={}", id);
        
        Logistics existing = logisticsMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 2) {
            return Result.error(404, "物流记录不存在");
        }
        
        UpdateWrapper<Logistics> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id);
        wrapper.set("del_flag", 2);
        wrapper.set("updated_at", LocalDateTime.now());
        
        logisticsMapper.update(null, wrapper);
        return Result.success("删除成功", null);
    }

    private String generateLogisticsCode() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "LOG" + dateStr + "%";
        String maxCode = logisticsMapper.selectMaxCode(prefix);
        
        int nextNum = 1;
        if (maxCode != null && maxCode.length() >= 14) {
            String numPart = maxCode.substring(maxCode.length() - 4);
            try {
                nextNum = Integer.parseInt(numPart) + 1;
            } catch (NumberFormatException e) {
                nextNum = 1;
            }
        }
        
        return "LOG" + dateStr + String.format("%04d", nextNum);
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
