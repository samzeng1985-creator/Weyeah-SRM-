package com.weyeah.srm.supplier.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.ESupplierStatus;
import com.weyeah.srm.types.enums.ESupplierType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("supplier")
public class Supplier extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String code;

    private String name;

    private String shortName;

    private ESupplierType type;

    private ESupplierStatus status;

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
}
