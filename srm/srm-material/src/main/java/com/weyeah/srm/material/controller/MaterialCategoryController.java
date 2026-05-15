package com.weyeah.srm.material.controller;

import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.material.dto.MaterialCategoryCreateDTO;
import com.weyeah.srm.material.entity.MaterialCategory;
import com.weyeah.srm.material.service.MaterialCategoryService;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "物料分类管理", description = "物料分类相关接口")
@RestController
@RequestMapping("/api/material-categories")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class MaterialCategoryController {

    private final MaterialCategoryService categoryService;

    @Operation(summary = "获取分类树")
    @GetMapping("/tree")
    public Result<List<MaterialCategory>> getTree() {
        List<MaterialCategory> tree = categoryService.getTree();
        return Result.success(tree);
    }

    @Operation(summary = "获取分类详情")
    @GetMapping("/{id}")
    public Result<MaterialCategory> getById(@PathVariable Long id) {
        MaterialCategory category = categoryService.getById(id);
        return Result.success(category);
    }

    @Operation(summary = "根据编码获取分类")
    @GetMapping("/code/{code}")
    public Result<MaterialCategory> getByCode(@PathVariable String code) {
        MaterialCategory category = categoryService.getByCode(code);
        return Result.success(category);
    }

    @Operation(summary = "创建分类")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody MaterialCategoryCreateDTO createDTO) {
        Long id = categoryService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新分类")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id,
            @Valid @RequestBody MaterialCategoryCreateDTO updateDTO) {
        categoryService.update(id, updateDTO);
        return Result.success();
    }

    @Operation(summary = "删除分类")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return Result.success();
    }

    @Operation(summary = "更新分类状态")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        categoryService.updateStatus(id, status);
        return Result.success();
    }
}
