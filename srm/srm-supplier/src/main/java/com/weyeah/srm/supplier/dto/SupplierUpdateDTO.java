package com.weyeah.srm.supplier.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@SuppressWarnings("CPD")
public class SupplierUpdateDTO {

    private Long id;

    @Size(max = 200, message = "供应商名称长度不能超过200")
    private String name;

    @Size(max = 100, message = "供应商简称长度不能超过100")
    private String shortName;

    private String type;

    private String status;

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

    private LocalDate annualReviewDate;

    private String evaluationLevel;

    private Integer deliveryScore;

    private Integer qualityScore;

    private Integer serviceScore;

    private String remark;
}
