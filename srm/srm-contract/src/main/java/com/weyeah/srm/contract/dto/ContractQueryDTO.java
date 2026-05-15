package com.weyeah.srm.contract.dto;

import lombok.Data;

@Data
public class ContractQueryDTO {

    private String keyword;

    private String supplierId;

    private String type;

    private String status;

    private Integer pageNum = 1;

    private Integer pageSize = 10;

}
