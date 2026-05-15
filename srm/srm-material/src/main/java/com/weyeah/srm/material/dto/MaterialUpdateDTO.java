package com.weyeah.srm.material.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
@SuppressWarnings("CPD")
public class MaterialUpdateDTO {

    private Long id;

    @Size(max = 200, message = "物料名称长度不能超过200")
    private String name;

    @Size(max = 200, message = "规格长度不能超过200")
    private String specification;

    @Size(max = 200, message = "型号长度不能超过200")
    private String model;

    @Size(max = 100, message = "品牌长度不能超过100")
    private String brand;

    private String unit;

    private Long categoryId;

    private String status;

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
