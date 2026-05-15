package com.weyeah.srm.organization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DepartmentCreateDTO {

    @NotBlank(message = "部门编码不能为空")
    @Size(max = 50, message = "部门编码长度不能超过50")
    private String code;

    @NotBlank(message = "部门名称不能为空")
    @Size(max = 200, message = "部门名称长度不能超过200")
    private String name;

    @NotBlank(message = "组织类型不能为空")
    private String type;

    private Long parentId;

    private Integer sortOrder;

    private String leaderId;

    private String remark;
}
