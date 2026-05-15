package com.weyeah.srm.material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@SuppressWarnings("CPD")
public class MaterialCategoryCreateDTO {

    @NotBlank(message = "分类编码不能为空")
    @Size(max = 50, message = "分类编码长度不能超过50")
    private String code;

    @NotBlank(message = "分类名称不能为空")
    @Size(max = 100, message = "分类名称长度不能超过100")
    private String name;

    private Long parentId;

    private Integer sortOrder;

    private String description;
}
