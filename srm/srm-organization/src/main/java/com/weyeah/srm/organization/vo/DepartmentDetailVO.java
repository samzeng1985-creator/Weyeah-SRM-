package com.weyeah.srm.organization.vo;

import lombok.Data;

@Data
public class DepartmentDetailVO {

    private Long id;

    private String code;

    private String name;

    private String type;

    private String typeDesc;

    private Long parentId;

    private String fullPath;

    private Integer sortOrder;

    private String leaderId;

    private String remark;

    private String createTime;

    private String updateTime;
}
