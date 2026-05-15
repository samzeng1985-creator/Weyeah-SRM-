package com.weyeah.srm.organization.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreateDTO {

    @NotBlank(message = "用户名不能为空")
    @Size(max = 50, message = "用户名长度不能超过50")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 32, message = "密码长度必须在6-32之间")
    private String password;

    @NotBlank(message = "真实姓名不能为空")
    @Size(max = 100, message = "真实姓名长度不能超过100")
    private String realName;

    @Email(message = "邮箱格式不正确")
    private String email;

    private String phone;

    private Long departmentId;

    private String avatar;

    private String remark;
}
