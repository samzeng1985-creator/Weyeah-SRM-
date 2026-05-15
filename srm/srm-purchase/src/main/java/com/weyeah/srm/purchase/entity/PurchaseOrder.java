package com.weyeah.srm.purchase.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.EPurchaseStatus;
import com.weyeah.srm.types.enums.EPurchaseType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("purchase_order")
public class PurchaseOrder extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String orderNo;

    private String title;

    private EPurchaseType type;

    private EPurchaseStatus status;

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
}
