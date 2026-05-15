package com.weyeah.srm.organization.dto;

import lombok.Data;

@Data
public class UserQueryDTO {

    private String keyword;

    private Long departmentId;

    private String status;

    private Integer pageNum = 1;

    private Integer pageSize = 10;
}
