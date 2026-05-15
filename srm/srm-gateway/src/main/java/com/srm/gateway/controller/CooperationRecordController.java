package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.srm.gateway.entity.CooperationRecord;
import com.srm.gateway.mapper.CooperationRecordMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/cooperation-records")
@RequiredArgsConstructor
@Tag(name = "合作记录管理")
@CrossOrigin(origins = "*")
public class CooperationRecordController {
    
    @Autowired
    private CooperationRecordMapper cooperationRecordMapper;
    
    @Operation(summary = "获取供应商的所有合作记录")
    @GetMapping("/supplier/{supplierId}")
    public Result<List<CooperationRecord>> getBySupplierId(@PathVariable("supplierId") Long supplierId) {
        log.info("获取合作记录: supplierId={}", supplierId);
        QueryWrapper<CooperationRecord> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId)
               .eq("del_flag", 0)
               .orderByDesc("start_date");
        List<CooperationRecord> list = cooperationRecordMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }
    
    @Operation(summary = "获取合作记录详情")
    @GetMapping("/{id}")
    public Result<CooperationRecord> getById(@PathVariable("id") Long id) {
        log.info("获取合作记录详情: id={}", id);
        CooperationRecord record = cooperationRecordMapper.selectById(id);
        return Result.success("查询成功", record);
    }
    
    @Operation(summary = "创建合作记录")
    @PostMapping
    public Result<Long> create(@RequestBody CooperationRecord record) {
        log.info("创建合作记录: {}", record);
        record.setDelFlag(0);
        cooperationRecordMapper.insert(record);
        return Result.success("创建成功", record.getId());
    }
    
    @Operation(summary = "更新合作记录")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody CooperationRecord record) {
        log.info("更新合作记录: id={}, data={}", id, record);
        record.setId(id);
        cooperationRecordMapper.updateById(record);
        return Result.success("更新成功", null);
    }
    
    @Operation(summary = "删除合作记录")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除合作记录: id={}", id);
        CooperationRecord record = new CooperationRecord();
        record.setId(id);
        record.setDelFlag(2);
        cooperationRecordMapper.updateById(record);
        return Result.success("删除成功", null);
    }
}
