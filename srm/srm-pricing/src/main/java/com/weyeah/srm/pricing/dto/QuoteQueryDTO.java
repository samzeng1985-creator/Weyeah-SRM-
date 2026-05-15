package com.weyeah.srm.pricing.dto;

import lombok.Data;

@Data
public class QuoteQueryDTO {

    private String keyword;

    private String supplierId;

    private String materialId;

    private String status;

    private Integer pageNum = 1;

    private Integer pageSize = 10;
}
