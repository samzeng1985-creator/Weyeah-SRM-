package com.weyeah.srm.purchase.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DeliveryDetailVO {

    private Long id;

    private String deliveryNo;

    private Long purchaseOrderId;

    private String status;

    private String statusDesc;

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

    private String createTime;

    private String updateTime;
}
