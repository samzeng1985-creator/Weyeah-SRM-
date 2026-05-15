package com.weyeah.srm.workflow.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.EWorkflowStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("workflow_instance")
public class WorkflowInstance extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String instanceNo;

    private Long definitionId;

    private String businessType;

    private Long businessId;

    private String businessData;

    private EWorkflowStatus status;

    private String currentNode;

    private Long applicantId;

    private String applicantName;

    private LocalDateTime submitTime;

    private LocalDateTime completeTime;

    private String feishuInstanceId;

    private String remark;
}
