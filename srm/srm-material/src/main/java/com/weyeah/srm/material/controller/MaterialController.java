package com.weyeah.srm.material.controller;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.material.dto.MaterialCreateDTO;
import com.weyeah.srm.material.dto.MaterialQueryDTO;
import com.weyeah.srm.material.dto.MaterialUpdateDTO;
import com.weyeah.srm.material.entity.Material;
import com.weyeah.srm.material.service.MaterialService;
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

@Tag(name = "物料管理", description = "物料相关接口")
@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class MaterialController {

    private final MaterialService materialService;

    @Operation(summary = "分页查询物料")
    @GetMapping
    public Result<PageResult<Material>> queryPage(MaterialQueryDTO queryDTO) {
        PageResult<Material> page = materialService.queryPage(queryDTO);
        return Result.success(page);
    }

    @Operation(summary = "获取物料详情")
    @GetMapping("/{id}")
    public Result<Material> getById(@PathVariable Long id) {
        Material material = materialService.getById(id);
        return Result.success(material);
    }

    @Operation(summary = "根据编码获取物料")
    @GetMapping("/code/{code}")
    public Result<Material> getByCode(@PathVariable String code) {
        Material material = materialService.getByCode(code);
        return Result.success(material);
    }

    @Operation(summary = "获取所有已启用物料")
    @GetMapping("/active")
    public Result<List<Material>> listActive() {
        List<Material> materials = materialService.listActive();
        return Result.success(materials);
    }

    @Operation(summary = "创建物料")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody MaterialCreateDTO createDTO) {
        Long id = materialService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新物料")
    @PutMapping
    public Result<Void> update(@Valid @RequestBody MaterialUpdateDTO updateDTO) {
        materialService.update(updateDTO);
        return Result.success();
    }

    @Operation(summary = "删除物料")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        materialService.delete(id);
        return Result.success();
    }

    @Operation(summary = "更新物料状态")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        materialService.updateStatus(id, status);
        return Result.success();
    }
}
