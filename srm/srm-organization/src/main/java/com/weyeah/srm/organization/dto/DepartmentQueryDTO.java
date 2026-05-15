package com.weyeah.srm.organization.dto;

import lombok.Data;

@Data
public class DepartmentQueryDTO {

    private String keyword;

    private Long parentId;

    private String type;

    private Integer pageNum = 1;

    private Integer pageSize = 10;
}
