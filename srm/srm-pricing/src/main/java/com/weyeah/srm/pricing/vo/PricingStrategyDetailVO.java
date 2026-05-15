package com.weyeah.srm.pricing.vo;

import lombok.Data;

@Data
public class PricingStrategyDetailVO {

    private Long id;

    private String code;

    private String name;

    private String type;

    private String typeDesc;

    private String status;

    private String statusDesc;

    private Long materialId;

    private Long supplierId;

    private Long categoryId;

    private java.math.BigDecimal unitPrice;

    private java.math.BigDecimal minQuantity;

    private java.math.BigDecimal maxQuantity;

    private java.math.BigDecimal discountRate;

    private String effectiveDate;

    private String expiryDate;

    private String currency;

    private String description;

    private String createTime;

    private String updateTime;
}
