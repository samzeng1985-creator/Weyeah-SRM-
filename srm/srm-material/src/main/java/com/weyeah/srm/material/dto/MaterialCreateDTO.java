package com.weyeah.srm.material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@SuppressWarnings("CPD")
public class MaterialCreateDTO {

    @NotBlank(message = "物料编码不能为空")
    @Size(max = 50, message = "物料编码长度不能超过50")
    private String code;

    @NotBlank(message = "物料名称不能为空")
    @Size(max = 200, message = "物料名称长度不能超过200")
    private String name;

    @Size(max = 200, message = "规格长度不能超过200")
    private String specification;

    @Size(max = 200, message = "型号长度不能超过200")
    private String model;

    @Size(max = 100, message = "品牌长度不能超过100")
    private String brand;

    @NotBlank(message = "单位不能为空")
    private String unit;

    private Long categoryId;

    private String materialType;

    private String origin;

    private String hsCode;

    private String description;

    private String technicalParameter;
}
