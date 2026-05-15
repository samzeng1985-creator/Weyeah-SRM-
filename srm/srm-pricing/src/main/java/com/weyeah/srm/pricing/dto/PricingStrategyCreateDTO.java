package com.weyeah.srm.pricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PricingStrategyCreateDTO {

    @NotBlank(message = "策略编码不能为空")
    @Size(max = 50, message = "策略编码长度不能超过50")
    private String code;

    @NotBlank(message = "策略名称不能为空")
    @Size(max = 200, message = "策略名称长度不能超过200")
    private String name;

    @NotBlank(message = "定价类型不能为空")
    private String type;

    @NotNull(message = "物料ID不能为空")
    private Long materialId;

    private Long supplierId;

    private Long categoryId;

    @NotNull(message = "单价不能为空")
    private BigDecimal unitPrice;

    private BigDecimal minQuantity;

    private BigDecimal maxQuantity;

    private BigDecimal discountRate;

    @NotNull(message = "生效日期不能为空")
    private LocalDate effectiveDate;

    @NotNull(message = "失效日期不能为空")
    private LocalDate expiryDate;

    private String currency;

    private String description;
}
