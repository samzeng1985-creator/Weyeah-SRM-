package com.weyeah.srm.pricing.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.EPricingStatus;
import com.weyeah.srm.types.enums.EPricingType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("pricing_strategy")
public class PricingStrategy extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String code;

    private String name;

    private EPricingType type;

    private EPricingStatus status;

    private Long materialId;

    private Long supplierId;

    private Long categoryId;

    private BigDecimal unitPrice;

    private BigDecimal minQuantity;

    private BigDecimal maxQuantity;

    private BigDecimal discountRate;

    private LocalDate effectiveDate;

    private LocalDate expiryDate;

    private String currency;

    private String description;
}
