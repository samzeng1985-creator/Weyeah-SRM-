package com.weyeah.srm.material.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("material_supplier_rel")
public class MaterialSupplierRel extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long materialId;

    private Long supplierId;

    private BigDecimal supplierPrice;

    private BigDecimal minOrderQuantity;

    private Integer leadTime;

    private String supplierMaterialCode;

    private Boolean isPreferred;
}
