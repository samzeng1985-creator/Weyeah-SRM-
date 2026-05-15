package com.weyeah.srm.purchase.controller;

import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.purchase.dto.DeliveryCreateDTO;
import com.weyeah.srm.purchase.entity.Delivery;
import com.weyeah.srm.purchase.service.DeliveryService;
import com.weyeah.srm.purchase.vo.DeliveryDetailVO;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "交货管理", description = "交货单相关接口")
@RestController
@RequestMapping("/api/purchase/deliveries")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @Operation(summary = "根据订单获取交货单列表")
    @GetMapping("/order/{purchaseOrderId}")
    public Result<List<Delivery>> listByOrder(@PathVariable Long purchaseOrderId) {
        List<Delivery> deliveries = deliveryService.listByOrder(purchaseOrderId);
        return Result.success(deliveries);
    }

    @Operation(summary = "获取交货单详情")
    @GetMapping("/{id}")
    public Result<DeliveryDetailVO> getById(@PathVariable Long id) {
        DeliveryDetailVO vo = deliveryService.getById(id);
        return Result.success(vo);
    }

    @Operation(summary = "创建交货单")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody DeliveryCreateDTO createDTO) {
        Long id = deliveryService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新交货单")
    @PutMapping
    public Result<Void> update(@Valid @RequestBody Delivery delivery) {
        deliveryService.update(delivery);
        return Result.success();
    }

    @Operation(summary = "发货")
    @PostMapping("/{id}/ship")
    public Result<Void> ship(@PathVariable Long id) {
        deliveryService.ship(id);
        return Result.success();
    }

    @Operation(summary = "到货确认")
    @PostMapping("/{id}/arrive")
    public Result<Void> arrive(@PathVariable Long id) {
        deliveryService.arrive(id);
        return Result.success();
    }

    @Operation(summary = "删除交货单")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        deliveryService.delete(id);
        return Result.success();
    }
}
