package com.weyeah.srm.material.dto;

import lombok.Data;

@Data
public class MaterialQueryDTO {

    private String keyword;

    private String categoryId;

    private String status;

    private Integer pageNum = 1;

    private Integer pageSize = 10;
}
