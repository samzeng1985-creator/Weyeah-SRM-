package com.weyeah.srm.organization.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.EOrgType;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("org_department")
public class OrgDepartment extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String code;

    private String name;

    private EOrgType type;

    private Long parentId;

    private String fullPath;

    private Integer sortOrder;

    private String leaderId;

    private String remark;
}
