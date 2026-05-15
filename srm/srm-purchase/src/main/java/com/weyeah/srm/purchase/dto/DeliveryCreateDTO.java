package com.weyeah.srm.purchase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DeliveryCreateDTO {

    @NotNull(message = "采购订单ID不能为空")
    private Long purchaseOrderId;

    @NotBlank(message = "承运商不能为空")
    private String carrier;

    private String trackingNo;

    @NotNull(message = "发货日期不能为空")
    private LocalDate shippedDate;

    private LocalDate estimatedArrivalDate;

    @NotBlank(message = "收货地址不能为空")
    private String shippingAddress;

    @NotBlank(message = "收货人姓名不能为空")
    private String receiverName;

    @NotBlank(message = "收货人电话不能为空")
    private String receiverPhone;

    private String remark;
}
