package com.weyeah.srm.organization.vo;

import lombok.Data;

@Data
public class UserDetailVO {

    private Long id;

    private String username;

    private String realName;

    private String email;

    private String phone;

    private Long departmentId;

    private String status;

    private String statusDesc;

    private String avatar;

    private String remark;

    private String createTime;

    private String updateTime;
}
