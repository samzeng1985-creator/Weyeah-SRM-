package com.weyeah.srm.contract.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ContractUpdateDTO {

    private Long id;

    private String name;

    private String status;

    private BigDecimal totalAmount;

    private String currency;

    private LocalDate effectiveDate;

    private LocalDate expiryDate;

    private String partyA;

    private String partyB;

    private String contractFileUrl;

    private String variables;

    private String description;

}
