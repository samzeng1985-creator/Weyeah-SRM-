package com.weyeah.srm.purchase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReceivingCreateDTO {

    @NotNull(message = "交货单ID不能为空")
    private Long deliveryId;

    @NotNull(message = "采购订单ID不能为空")
    private Long purchaseOrderId;

    @NotNull(message = "收货数量不能为空")
    private java.math.BigDecimal receivedQuantity;

    @NotNull(message = "合格数量不能为空")
    private java.math.BigDecimal qualifiedQuantity;

    private java.math.BigDecimal defectiveQuantity;

    @NotBlank(message = "检验员不能为空")
    private String inspector;

    private String inspectionResult;

    private String qualityReportUrl;

    private String remark;
}
