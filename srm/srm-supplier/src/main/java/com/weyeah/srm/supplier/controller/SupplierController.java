package com.weyeah.srm.supplier.controller;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.supplier.dto.SupplierCreateDTO;
import com.weyeah.srm.supplier.dto.SupplierQueryDTO;
import com.weyeah.srm.supplier.dto.SupplierUpdateDTO;
import com.weyeah.srm.supplier.entity.Supplier;
import com.weyeah.srm.supplier.service.SupplierService;
import com.weyeah.srm.supplier.vo.SupplierDetailVO;
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

@Tag(name = "供应商管理", description = "供应商相关接口")
@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class SupplierController {

    private final SupplierService supplierService;

    @Operation(summary = "分页查询供应商")
    @GetMapping
    public Result<PageResult<Supplier>> queryPage(SupplierQueryDTO queryDTO) {
        PageResult<Supplier> page = supplierService.queryPage(queryDTO);
        return Result.success(page);
    }

    @Operation(summary = "获取供应商详情")
    @GetMapping("/{id}")
    public Result<SupplierDetailVO> getById(@PathVariable Long id) {
        SupplierDetailVO vo = supplierService.getById(id);
        return Result.success(vo);
    }

    @Operation(summary = "根据编码获取供应商")
    @GetMapping("/code/{code}")
    public Result<Supplier> getByCode(@PathVariable String code) {
        Supplier supplier = supplierService.getByCode(code);
        return Result.success(supplier);
    }

    @Operation(summary = "获取所有已生效供应商")
    @GetMapping("/active")
    public Result<List<Supplier>> listActive() {
        List<Supplier> suppliers = supplierService.listActive();
        return Result.success(suppliers);
    }

    @Operation(summary = "创建供应商")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody SupplierCreateDTO createDTO) {
        Long id = supplierService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新供应商信息")
    @PutMapping
    public Result<Void> update(@Valid @RequestBody SupplierUpdateDTO updateDTO) {
        supplierService.update(updateDTO);
        return Result.success();
    }

    @Operation(summary = "更新供应商状态")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        supplierService.updateStatus(id, status);
        return Result.success();
    }

    @Operation(summary = "删除供应商")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return Result.success();
    }

    @Operation(summary = "审核供应商")
    @PostMapping("/{id}/review")
    public Result<Void> review(@PathVariable Long id, @RequestParam String pass) {
        supplierService.review(id, pass);
        return Result.success();
    }

    @Operation(summary = "获取已生效供应商数量")
    @GetMapping("/count/active")
    public Result<Integer> countActive() {
        int count = supplierService.countActive();
        return Result.success(count);
    }
}
