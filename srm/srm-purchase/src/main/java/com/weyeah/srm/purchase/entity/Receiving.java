package com.weyeah.srm.purchase.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("receiving")
public class Receiving extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String receivingNo;

    private Long deliveryId;

    private Long purchaseOrderId;

    private BigDecimal receivedQuantity;

    private BigDecimal qualifiedQuantity;

    private BigDecimal defectiveQuantity;

    private String inspector;

    private LocalDateTime inspectionTime;

    private String inspectionResult;

    private String qualityReportUrl;

    private String remark;
}
