package com.weyeah.srm.purchase.dto;

import lombok.Data;

@Data
public class PurchaseOrderQueryDTO {

    private String keyword;

    private String supplierId;

    private String materialId;

    private String type;

    private String status;

    private Integer pageNum = 1;

    private Integer pageSize = 10;
}
