package com.weyeah.srm.pricing.controller;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.pricing.dto.PricingQueryDTO;
import com.weyeah.srm.pricing.dto.PricingStrategyCreateDTO;
import com.weyeah.srm.pricing.dto.PricingStrategyUpdateDTO;
import com.weyeah.srm.pricing.entity.PricingStrategy;
import com.weyeah.srm.pricing.service.PricingStrategyService;
import com.weyeah.srm.pricing.vo.PricingStrategyDetailVO;
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

@Tag(name = "定价策略管理", description = "定价策略相关接口")
@RestController
@RequestMapping("/api/pricing/strategies")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class PricingStrategyController {

    private final PricingStrategyService pricingStrategyService;

    @Operation(summary = "分页查询定价策略")
    @GetMapping
    public Result<PageResult<PricingStrategy>> queryPage(PricingQueryDTO queryDTO) {
        PageResult<PricingStrategy> page = pricingStrategyService.queryPage(queryDTO);
        return Result.success(page);
    }

    @Operation(summary = "获取定价策略详情")
    @GetMapping("/{id}")
    public Result<PricingStrategyDetailVO> getById(@PathVariable Long id) {
        PricingStrategyDetailVO vo = pricingStrategyService.getById(id);
        return Result.success(vo);
    }

    @Operation(summary = "根据编码获取定价策略")
    @GetMapping("/code/{code}")
    public Result<PricingStrategy> getByCode(@PathVariable String code) {
        PricingStrategy strategy = pricingStrategyService.getByCode(code);
        return Result.success(strategy);
    }

    @Operation(summary = "获取所有已生效定价策略")
    @GetMapping("/active")
    public Result<List<PricingStrategy>> listActive() {
        List<PricingStrategy> strategies = pricingStrategyService.listActive();
        return Result.success(strategies);
    }

    @Operation(summary = "根据物料获取定价策略")
    @GetMapping("/material/{materialId}")
    public Result<List<PricingStrategy>> listByMaterial(@PathVariable Long materialId) {
        List<PricingStrategy> strategies = pricingStrategyService.listByMaterial(materialId);
        return Result.success(strategies);
    }

    @Operation(summary = "根据供应商获取定价策略")
    @GetMapping("/supplier/{supplierId}")
    public Result<List<PricingStrategy>> listBySupplier(@PathVariable Long supplierId) {
        List<PricingStrategy> strategies = pricingStrategyService.listBySupplier(supplierId);
        return Result.success(strategies);
    }

    @Operation(summary = "创建定价策略")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody PricingStrategyCreateDTO createDTO) {
        Long id = pricingStrategyService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新定价策略")
    @PutMapping
    public Result<Void> update(@Valid @RequestBody PricingStrategyUpdateDTO updateDTO) {
        pricingStrategyService.update(updateDTO);
        return Result.success();
    }

    @Operation(summary = "更新定价策略状态")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        pricingStrategyService.updateStatus(id, status);
        return Result.success();
    }

    @Operation(summary = "删除定价策略")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        pricingStrategyService.delete(id);
        return Result.success();
    }

    @Operation(summary = "激活定价策略")
    @PostMapping("/{id}/activate")
    public Result<Void> activate(@PathVariable Long id) {
        pricingStrategyService.activate(id);
        return Result.success();
    }

    @Operation(summary = "使定价策略过期")
    @PostMapping("/{id}/expire")
    public Result<Void> expire(@PathVariable Long id) {
        pricingStrategyService.expire(id);
        return Result.success();
    }

    @Operation(summary = "获取已生效策略数量")
    @GetMapping("/count/active")
    public Result<Integer> countActive() {
        int count = pricingStrategyService.countActive();
        return Result.success(count);
    }
}
