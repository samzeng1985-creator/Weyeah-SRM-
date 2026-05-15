package com.weyeah.srm.supplier.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@SuppressWarnings("CPD")
public class SupplierCreateDTO {

    @NotBlank(message = "供应商编码不能为空")
    @Size(max = 50, message = "供应商编码长度不能超过50")
    private String code;

    @NotBlank(message = "供应商名称不能为空")
    @Size(max = 200, message = "供应商名称长度不能超过200")
    private String name;

    @Size(max = 100, message = "供应商简称长度不能超过100")
    private String shortName;

    @NotBlank(message = "供应商类型不能为空")
    private String type;

    private String country;

    private String city;

    private String address;

    @Size(max = 100, message = "联系人姓名长度不能超过100")
    private String contactPerson;

    @Size(max = 50, message = "联系电话长度不能超过50")
    private String contactPhone;

    @Email(message = "邮箱格式不正确")
    private String contactEmail;

    @Size(max = 50, message = "税号长度不能超过50")
    private String taxNumber;

    @Size(max = 100, message = "营业执照号长度不能超过100")
    private String businessLicense;

    @Size(max = 200, message = "开户银行长度不能超过200")
    private String bankName;

    @Size(max = 50, message = "银行账号长度不能超过50")
    private String bankAccount;

    private BigDecimal annualCapacity;

    private String mainProducts;

    private String qualityCertification;

    private String isoCertificate;

    private LocalDate registeredDate;

    private String remark;
}
