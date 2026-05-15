package com.weyeah.srm.organization.dto;

import lombok.Data;

@Data
public class DepartmentUpdateDTO {

    private Long id;

    private String name;

    private Long parentId;

    private Integer sortOrder;

    private String leaderId;

    private String remark;
}
