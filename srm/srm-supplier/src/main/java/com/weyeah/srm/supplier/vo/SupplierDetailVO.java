package com.weyeah.srm.supplier.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SupplierDetailVO {

    private Long id;

    private String code;

    private String name;

    private String shortName;

    private String type;

    private String typeDesc;

    private String status;

    private String statusDesc;

    private String country;

    private String city;

    private String address;

    private String contactPerson;

    private String contactPhone;

    private String contactEmail;

    private String taxNumber;

    private String businessLicense;

    private String bankName;

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

    private Integer comprehensiveScore;

    private String createBy;

    private String createTime;

    private String updateBy;

    private String updateTime;

    private String remark;
}
