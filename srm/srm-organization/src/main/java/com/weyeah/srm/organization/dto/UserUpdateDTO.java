package com.weyeah.srm.organization.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {

    private Long id;

    private String realName;

    private String email;

    private String phone;

    private Long departmentId;

    private String status;

    private String avatar;

    private String remark;
}
