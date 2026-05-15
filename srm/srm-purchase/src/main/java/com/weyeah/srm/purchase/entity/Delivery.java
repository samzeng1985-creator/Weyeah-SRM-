package com.weyeah.srm.purchase.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.EDeliveryStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("delivery")
public class Delivery extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String deliveryNo;

    private Long purchaseOrderId;

    private EDeliveryStatus status;

    private String carrier;

    private String trackingNo;

    private LocalDate shippedDate;

    private LocalDate estimatedArrivalDate;

    private LocalDate actualArrivalDate;

    private String shippingAddress;

    private String receiverName;

    private String receiverPhone;

    private BigDecimal shippingFee;

    private String remark;
}
