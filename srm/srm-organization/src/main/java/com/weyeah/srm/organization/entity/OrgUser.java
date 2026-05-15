package com.weyeah.srm.organization.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.EUserStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("org_user")
public class OrgUser extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String username;

    private String password;

    private String realName;

    private String email;

    private String phone;

    private Long departmentId;

    private EUserStatus status;

    private String avatar;

    private String remark;
}
