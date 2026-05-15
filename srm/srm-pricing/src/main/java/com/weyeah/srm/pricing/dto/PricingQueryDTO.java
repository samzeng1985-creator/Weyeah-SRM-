package com.weyeah.srm.pricing.dto;

import lombok.Data;

@Data
public class PricingQueryDTO {

    private String keyword;

    private String materialId;

    private String supplierId;

    private String type;

    private String status;

    private Integer pageNum = 1;

    private Integer pageSize = 10;
}
