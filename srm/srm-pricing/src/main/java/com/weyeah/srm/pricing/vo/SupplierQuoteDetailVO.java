package com.weyeah.srm.pricing.vo;

import lombok.Data;

@Data
public class SupplierQuoteDetailVO {

    private Long id;

    private String quoteNumber;

    private Long supplierId;

    private Long materialId;

    private Long pricingStrategyId;

    private String status;

    private String statusDesc;

    private java.math.BigDecimal unitPrice;

    private java.math.BigDecimal minOrderQuantity;

    private java.math.BigDecimal discountRate;

    private java.math.BigDecimal totalAmount;

    private String quoteDate;

    private String validUntil;

    private String currency;

    private String paymentTerms;

    private Integer leadTime;

    private String quoteFileUrl;

    private String remark;

    private String createTime;

    private String updateTime;
}
