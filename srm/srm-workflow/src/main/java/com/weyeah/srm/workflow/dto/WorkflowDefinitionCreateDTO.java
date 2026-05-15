package com.weyeah.srm.workflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WorkflowDefinitionCreateDTO {

    @NotBlank(message = "流程编码不能为空")
    @Size(max = 50, message = "流程编码长度不能超过50")
    private String code;

    @NotBlank(message = "流程名称不能为空")
    @Size(max = 200, message = "流程名称长度不能超过200")
    private String name;

    @NotBlank(message = "流程类型不能为空")
    private String type;

    private String formSchema;

    private String flowConfig;

    private String approverRules;

    private Boolean isActive;
}
