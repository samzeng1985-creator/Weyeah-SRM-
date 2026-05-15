package com.weyeah.srm.purchase.controller;

import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.purchase.dto.ReceivingCreateDTO;
import com.weyeah.srm.purchase.entity.Receiving;
import com.weyeah.srm.purchase.service.ReceivingService;
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

@Tag(name = "收货管理", description = "收货记录相关接口")
@RestController
@RequestMapping("/api/purchase/receivings")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class ReceivingController {

    private final ReceivingService receivingService;

    @Operation(summary = "根据交货单获取收货记录")
    @GetMapping("/delivery/{deliveryId}")
    public Result<List<Receiving>> listByDelivery(@PathVariable Long deliveryId) {
        List<Receiving> receivings = receivingService.listByDelivery(deliveryId);
        return Result.success(receivings);
    }

    @Operation(summary = "根据订单获取收货记录")
    @GetMapping("/order/{purchaseOrderId}")
    public Result<List<Receiving>> listByOrder(@PathVariable Long purchaseOrderId) {
        List<Receiving> receivings = receivingService.listByOrder(purchaseOrderId);
        return Result.success(receivings);
    }

    @Operation(summary = "获取收货记录详情")
    @GetMapping("/{id}")
    public Result<Receiving> getById(@PathVariable Long id) {
        Receiving receiving = receivingService.getById(id);
        return Result.success(receiving);
    }

    @Operation(summary = "创建收货记录")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody ReceivingCreateDTO createDTO) {
        Long id = receivingService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新收货记录")
    @PutMapping
    public Result<Void> update(@Valid @RequestBody Receiving receiving) {
        receivingService.update(receiving);
        return Result.success();
    }

    @Operation(summary = "删除收货记录")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        receivingService.delete(id);
        return Result.success();
    }
}
