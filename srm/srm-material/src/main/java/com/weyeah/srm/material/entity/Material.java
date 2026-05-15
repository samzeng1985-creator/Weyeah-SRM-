package com.weyeah.srm.material.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.EMaterialStatus;
import com.weyeah.srm.types.enums.EMaterialUnit;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("material")
public class Material extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String code;

    private String name;

    private String specification;

    private String model;

    private String brand;

    private EMaterialUnit unit;

    private Long categoryId;

    private EMaterialStatus status;

    private BigDecimal standardPrice;

    private BigDecimal minOrderQuantity;

    private BigDecimal safetyStock;

    private Integer shelfLife;

    private String origin;

    private String hsCode;

    private String materialType;

    private String description;

    private String technicalParameter;
}
