package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.srm.gateway.entity.MaterialDrawing;
import com.srm.gateway.mapper.MaterialDrawingMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "物料图纸管理", description = "物料图纸相关接口")
@RestController
@RequestMapping("/api/material-drawings")
public class MaterialDrawingController {
    private static final Logger log = LoggerFactory.getLogger(MaterialDrawingController.class);
    private final MaterialDrawingMapper materialDrawingMapper;

    public MaterialDrawingController(MaterialDrawingMapper materialDrawingMapper) {
        this.materialDrawingMapper = materialDrawingMapper;
    }

    @Operation(summary = "获取物料图纸列表")
    @GetMapping("/material/{materialId}")
    public Result<List<MaterialDrawing>> getByMaterialId(@PathVariable("materialId") Long materialId) {
        log.info("获取物料图纸列表，物料ID: {}", materialId);
        QueryWrapper<MaterialDrawing> wrapper = new QueryWrapper<>();
        wrapper.eq("material_id", materialId)
               .eq("del_flag", 0)
               .orderByDesc("created_at");
        List<MaterialDrawing> list = materialDrawingMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }

    @Operation(summary = "获取图纸详情")
    @GetMapping("/{id}")
    public Result<MaterialDrawing> getById(@PathVariable("id") Long id) {
        log.info("获取图纸详情，ID: {}", id);
        MaterialDrawing drawing = materialDrawingMapper.selectById(id);
        if (drawing == null || drawing.getDelFlag() == 1) {
            return Result.error(404, "图纸不存在");
        }
        return Result.success("查询成功", drawing);
    }

    @Operation(summary = "新增图纸")
    @PostMapping
    public Result<Long> create(@RequestBody MaterialDrawing drawing) {
        log.info("新增图纸，物料ID: {}, 图纸号: {}", drawing.getMaterialId(), drawing.getDrawingNo());
        
        drawing.setStatus("ACTIVE");
        drawing.setDownloadCount(0);
        drawing.setDelFlag(0);
        drawing.setCreatedAt(LocalDateTime.now());
        drawing.setUpdatedAt(LocalDateTime.now());
        
        materialDrawingMapper.insert(drawing);
        return Result.success("创建成功", drawing.getId());
    }

    @Operation(summary = "更新图纸")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody MaterialDrawing drawing) {
        log.info("更新图纸，ID: {}", id);
        
        MaterialDrawing existing = materialDrawingMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 1) {
            return Result.error(404, "图纸不存在");
        }
        
        drawing.setId(id);
        drawing.setUpdatedAt(LocalDateTime.now());
        materialDrawingMapper.updateById(drawing);
        
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除图纸")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除图纸，ID: {}", id);
        
        MaterialDrawing existing = materialDrawingMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 1) {
            return Result.error(404, "图纸不存在");
        }
        
        existing.setDelFlag(1);
        existing.setUpdatedAt(LocalDateTime.now());
        materialDrawingMapper.updateById(existing);
        
        return Result.success("删除成功", null);
    }

    @Operation(summary = "记录下载次数")
    @PostMapping("/{id}/download")
    public Result<Void> recordDownload(@PathVariable("id") Long id) {
        log.info("记录图纸下载，ID: {}", id);
        
        MaterialDrawing existing = materialDrawingMapper.selectById(id);
        if (existing == null || existing.getDelFlag() == 1) {
            return Result.error(404, "图纸不存在");
        }
        
        Integer currentCount = existing.getDownloadCount();
        existing.setDownloadCount(currentCount == null ? 1 : currentCount + 1);
        existing.setUpdatedAt(LocalDateTime.now());
        materialDrawingMapper.updateById(existing);
        
        return Result.success("记录成功", null);
    }
}
