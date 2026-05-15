package com.weyeah.srm.purchase.controller;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.purchase.dto.PurchaseOrderCreateDTO;
import com.weyeah.srm.purchase.dto.PurchaseOrderQueryDTO;
import com.weyeah.srm.purchase.dto.PurchaseOrderUpdateDTO;
import com.weyeah.srm.purchase.entity.PurchaseOrder;
import com.weyeah.srm.purchase.service.PurchaseOrderService;
import com.weyeah.srm.purchase.vo.PurchaseOrderDetailVO;
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

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "采购订单管理", description = "采购订单相关接口")
@RestController
@RequestMapping("/api/purchase/orders")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @Operation(summary = "分页查询采购订单")
    @GetMapping
    public Result<PageResult<PurchaseOrder>> queryPage(PurchaseOrderQueryDTO queryDTO) {
        PageResult<PurchaseOrder> page = purchaseOrderService.queryPage(queryDTO);
        return Result.success(page);
    }

    @Operation(summary = "获取采购订单详情")
    @GetMapping("/{id}")
    public Result<PurchaseOrderDetailVO> getById(@PathVariable Long id) {
        PurchaseOrderDetailVO vo = purchaseOrderService.getById(id);
        return Result.success(vo);
    }

    @Operation(summary = "根据订单号获取订单")
    @GetMapping("/number/{orderNo}")
    public Result<PurchaseOrder> getByOrderNo(@PathVariable String orderNo) {
        PurchaseOrder order = purchaseOrderService.getByOrderNo(orderNo);
        return Result.success(order);
    }

    @Operation(summary = "根据供应商获取订单列表")
    @GetMapping("/supplier/{supplierId}")
    public Result<List<PurchaseOrder>> listBySupplier(@PathVariable Long supplierId) {
        List<PurchaseOrder> orders = purchaseOrderService.listBySupplier(supplierId);
        return Result.success(orders);
    }

    @Operation(summary = "根据状态获取订单列表")
    @GetMapping("/status/{status}")
    public Result<List<PurchaseOrder>> listByStatus(@PathVariable String status) {
        List<PurchaseOrder> orders = purchaseOrderService.listByStatus(status);
        return Result.success(orders);
    }

    @Operation(summary = "创建采购订单")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody PurchaseOrderCreateDTO createDTO) {
        Long id = purchaseOrderService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新采购订单")
    @PutMapping
    public Result<Void> update(@Valid @RequestBody PurchaseOrderUpdateDTO updateDTO) {
        purchaseOrderService.update(updateDTO);
        return Result.success();
    }

    @Operation(summary = "删除采购订单")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        purchaseOrderService.delete(id);
        return Result.success();
    }

    @Operation(summary = "提交审批")
    @PostMapping("/{id}/submit")
    public Result<Void> submitForApproval(@PathVariable Long id) {
        purchaseOrderService.submitForApproval(id);
        return Result.success();
    }

    @Operation(summary = "审批通过")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id, @RequestParam(required = false) String approvalNo) {
        purchaseOrderService.approve(id, approvalNo);
        return Result.success();
    }

    @Operation(summary = "审批拒绝")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @RequestParam String reason) {
        purchaseOrderService.reject(id, reason);
        return Result.success();
    }

    @Operation(summary = "发送给供应商")
    @PostMapping("/{id}/send-to-supplier")
    public Result<Void> sendToSupplier(@PathVariable Long id) {
        purchaseOrderService.sendToSupplier(id);
        return Result.success();
    }

    @Operation(summary = "供应商确认")
    @PostMapping("/{id}/supplier-confirm")
    public Result<Void> confirmBySupplier(@PathVariable Long id) {
        purchaseOrderService.confirmBySupplier(id);
        return Result.success();
    }

    @Operation(summary = "更新交货信息")
    @PostMapping("/{id}/update-delivery")
    public Result<Void> updateDeliveryInfo(@PathVariable Long id, @RequestParam String deliveryDate) {
        purchaseOrderService.updateDeliveryInfo(id, deliveryDate);
        return Result.success();
    }

    @Operation(summary = "标记为已发货")
    @PostMapping("/{id}/delivered")
    public Result<Void> markAsDelivered(@PathVariable Long id) {
        purchaseOrderService.markAsDelivered(id);
        return Result.success();
    }

    @Operation(summary = "收货确认")
    @PostMapping("/{id}/receive")
    public Result<Void> receive(@PathVariable Long id, @RequestParam BigDecimal receivedQuantity) {
        purchaseOrderService.receive(id, receivedQuantity);
        return Result.success();
    }

    @Operation(summary = "完成订单")
    @PostMapping("/{id}/complete")
    public Result<Void> complete(@PathVariable Long id) {
        purchaseOrderService.complete(id);
        return Result.success();
    }

    @Operation(summary = "取消订单")
    @PostMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id) {
        purchaseOrderService.cancel(id);
        return Result.success();
    }

    @Operation(summary = "获取待审批订单数量")
    @GetMapping("/count/pending")
    public Result<Integer> countPending() {
        int count = purchaseOrderService.countPending();
        return Result.success(count);
    }
}
