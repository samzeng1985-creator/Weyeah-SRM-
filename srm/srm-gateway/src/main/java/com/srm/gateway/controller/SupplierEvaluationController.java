package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.srm.gateway.entity.SupplierEvaluation;
import com.srm.gateway.mapper.SupplierEvaluationMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/supplier-evaluations")
@RequiredArgsConstructor
@Tag(name = "供应商评估管理")
@CrossOrigin(origins = "*")
public class SupplierEvaluationController {
    
    @Autowired
    private SupplierEvaluationMapper evaluationMapper;
    
    @Operation(summary = "获取供应商的所有评估记录")
    @GetMapping("/supplier/{supplierId}")
    public Result<List<SupplierEvaluation>> getBySupplierId(@PathVariable("supplierId") Long supplierId) {
        log.info("获取评估记录: supplierId={}", supplierId);
        QueryWrapper<SupplierEvaluation> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId)
               .eq("del_flag", 0)
               .orderByDesc("evaluation_date");
        List<SupplierEvaluation> list = evaluationMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }
    
    @Operation(summary = "获取最新评估记录")
    @GetMapping("/supplier/{supplierId}/latest")
    public Result<SupplierEvaluation> getLatestBySupplierId(@PathVariable("supplierId") Long supplierId) {
        log.info("获取最新评估记录: supplierId={}", supplierId);
        QueryWrapper<SupplierEvaluation> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId)
               .eq("del_flag", 0)
               .orderByDesc("evaluation_date")
               .last("LIMIT 1");
        SupplierEvaluation evaluation = evaluationMapper.selectOne(wrapper);
        return Result.success("查询成功", evaluation);
    }
    
    @Operation(summary = "获取评估详情")
    @GetMapping("/{id}")
    public Result<SupplierEvaluation> getById(@PathVariable("id") Long id) {
        log.info("获取评估详情: id={}", id);
        SupplierEvaluation evaluation = evaluationMapper.selectById(id);
        return Result.success("查询成功", evaluation);
    }
    
    @Operation(summary = "创建评估记录")
    @PostMapping
    public Result<Long> create(@RequestBody SupplierEvaluation evaluation) {
        log.info("创建评估记录: {}", evaluation);
        
        if (evaluation.getQualityScore() != null || evaluation.getDeliveryScore() != null ||
            evaluation.getPriceScore() != null || evaluation.getServiceScore() != null) {
            BigDecimal total = new BigDecimal("0");
            if (evaluation.getQualityScore() != null) total = total.add(evaluation.getQualityScore().multiply(new BigDecimal("0.30")));
            if (evaluation.getDeliveryScore() != null) total = total.add(evaluation.getDeliveryScore().multiply(new BigDecimal("0.25")));
            if (evaluation.getPriceScore() != null) total = total.add(evaluation.getPriceScore().multiply(new BigDecimal("0.20")));
            if (evaluation.getServiceScore() != null) total = total.add(evaluation.getServiceScore().multiply(new BigDecimal("0.15")));
            evaluation.setComprehensiveScore(total);
            
            String rating = calculateRating(total);
            evaluation.setRating(rating);
        }
        
        evaluation.setDelFlag(0);
        evaluationMapper.insert(evaluation);
        return Result.success("创建成功", evaluation.getId());
    }
    
    @Operation(summary = "更新评估记录")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody SupplierEvaluation evaluation) {
        log.info("更新评估记录: id={}, data={}", id, evaluation);
        evaluation.setId(id);
        evaluationMapper.updateById(evaluation);
        return Result.success("更新成功", null);
    }
    
    @Operation(summary = "删除评估记录")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除评估记录: id={}", id);
        SupplierEvaluation evaluation = new SupplierEvaluation();
        evaluation.setId(id);
        evaluation.setDelFlag(2);
        evaluationMapper.updateById(evaluation);
        return Result.success("删除成功", null);
    }
    
    private String calculateRating(BigDecimal score) {
        if (score == null) return "D";
        if (score.compareTo(new BigDecimal("90")) >= 0) return "A";
        if (score.compareTo(new BigDecimal("80")) >= 0) return "B";
        if (score.compareTo(new BigDecimal("70")) >= 0) return "C";
        if (score.compareTo(new BigDecimal("60")) >= 0) return "D";
        return "E";
    }
}
