package com.weyeah.srm.pricing.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.EQuoteStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("supplier_quote")
public class SupplierQuote extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String quoteNumber;

    private Long supplierId;

    private Long materialId;

    private Long pricingStrategyId;

    private EQuoteStatus status;

    private BigDecimal unitPrice;

    private BigDecimal minOrderQuantity;

    private BigDecimal discountRate;

    private BigDecimal totalAmount;

    private LocalDateTime quoteDate;

    private LocalDateTime validUntil;

    private String currency;

    private String paymentTerms;

    private Integer leadTime;

    private String quoteFileUrl;

    private String remark;
}
