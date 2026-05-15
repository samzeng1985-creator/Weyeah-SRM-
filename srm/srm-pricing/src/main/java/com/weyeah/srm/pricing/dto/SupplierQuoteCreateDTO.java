package com.weyeah.srm.pricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SupplierQuoteCreateDTO {

    @NotNull(message = "供应商ID不能为空")
    private Long supplierId;

    @NotNull(message = "物料ID不能为空")
    private Long materialId;

    private Long pricingStrategyId;

    @NotNull(message = "单价不能为空")
    private BigDecimal unitPrice;

    private BigDecimal minOrderQuantity;

    private BigDecimal discountRate;

    @NotBlank(message = "有效期不能为空")
    private String validUntil;

    @NotBlank(message = "货币不能为空")
    private String currency;

    private String paymentTerms;

    private Integer leadTime;

    private String remark;
}
