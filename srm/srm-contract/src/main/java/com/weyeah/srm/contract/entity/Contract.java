package com.weyeah.srm.contract.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.EContractStatus;
import com.weyeah.srm.types.enums.EContractType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("contract")
public class Contract extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String contractNo;

    private String name;

    private EContractType type;

    private EContractStatus status;

    private Long supplierId;

    private BigDecimal totalAmount;

    private String currency;

    private LocalDate effectiveDate;

    private LocalDate expiryDate;

    private String partyA;

    private String partyB;

    private String contractFileUrl;

    private String templateCode;

    private String variables;

    private String description;

}
