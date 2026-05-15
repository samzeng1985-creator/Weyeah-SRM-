package com.weyeah.srm.contract.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ContractDetailVO {

    private Long id;

    private String contractNo;

    private String name;

    private String type;

    private String typeDesc;

    private String status;

    private String statusDesc;

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

    private String createTime;

    private String updateTime;

}
