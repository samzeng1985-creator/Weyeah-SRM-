package com.weyeah.srm.purchase.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PurchaseOrderDetailVO {

    private Long id;

    private String orderNo;

    private String title;

    private String type;

    private String typeDesc;

    private String status;

    private String statusDesc;

    private Long supplierId;

    private Long contractId;

    private Long materialId;

    private BigDecimal quantity;

    private BigDecimal unitPrice;

    private BigDecimal totalAmount;

    private String currency;

    private LocalDate requiredDate;

    private LocalDate deliveryDate;

    private String deliveryAddress;

    private String contactPerson;

    private String contactPhone;

    private String remark;

    private String approvalNo;

    private String feishuInstanceId;

    private String createTime;

    private String updateTime;
}
