package com.weyeah.srm.workflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WorkflowTaskActionDTO {

    @NotBlank(message = "任务ID不能为空")
    private Long taskId;

    @NotBlank(message = "操作不能为空")
    private String action;

    private String comment;
}
