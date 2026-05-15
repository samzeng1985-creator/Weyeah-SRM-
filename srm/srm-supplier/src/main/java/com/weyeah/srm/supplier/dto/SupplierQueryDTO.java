package com.weyeah.srm.supplier.dto;

import lombok.Data;

@Data
public class SupplierQueryDTO {

    private String keyword;

    private String type;

    private String status;

    private String country;

    private Integer pageNum = 1;

    private Integer pageSize = 10;
}
