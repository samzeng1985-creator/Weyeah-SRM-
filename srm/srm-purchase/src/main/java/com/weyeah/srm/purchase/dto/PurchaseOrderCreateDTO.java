package com.weyeah.srm.purchase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PurchaseOrderCreateDTO {

    @NotBlank(message = "订单标题不能为空")
    @Size(max = 200, message = "订单标题长度不能超过200")
    private String title;

    @NotBlank(message = "采购类型不能为空")
    private String type;

    @NotNull(message = "供应商ID不能为空")
    private Long supplierId;

    private Long contractId;

    private Long materialId;

    @NotNull(message = "数量不能为空")
    private BigDecimal quantity;

    @NotNull(message = "单价不能为空")
    private BigDecimal unitPrice;

    private String currency;

    @NotNull(message = "需求日期不能为空")
    private LocalDate requiredDate;

    private LocalDate deliveryDate;

    private String deliveryAddress;

    private String contactPerson;

    private String contactPhone;

    private String remark;
}
