package com.weyeah.srm.contract.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContractTemplateCreateDTO {

    @NotBlank(message = "模板编码不能为空")
    @Size(max = 50, message = "模板编码长度不能超过50")
    private String code;

    @NotBlank(message = "模板名称不能为空")
    @Size(max = 200, message = "模板名称长度不能超过200")
    private String name;

    @NotBlank(message = "模板类型不能为空")
    private String type;

    @NotBlank(message = "HTML内容不能为空")
    private String htmlContent;

    private String variableSchema;

    private String description;

    private Boolean isDefault;

}
