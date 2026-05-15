package com.weyeah.srm.pricing.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("price_history")
public class PriceHistory extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long materialId;

    private Long supplierId;

    private Long pricingStrategyId;

    private Long quoteId;

    private BigDecimal oldPrice;

    private BigDecimal newPrice;

    private BigDecimal changeRate;

    private String changeType;

    private String changeReason;
}
