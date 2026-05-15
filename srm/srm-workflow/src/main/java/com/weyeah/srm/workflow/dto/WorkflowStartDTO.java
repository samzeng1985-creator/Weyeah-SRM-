package com.weyeah.srm.workflow.dto;

import lombok.Data;

@Data
public class WorkflowStartDTO {

    private Long definitionId;

    private String businessType;

    private Long businessId;

    private String businessData;

    private Long applicantId;

    private String applicantName;
}
