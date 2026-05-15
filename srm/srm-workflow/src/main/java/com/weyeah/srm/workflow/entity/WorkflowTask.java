package com.weyeah.srm.workflow.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("workflow_task")
public class WorkflowTask extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long instanceId;

    private String nodeKey;

    private String nodeName;

    private Long assigneeId;

    private String assigneeName;

    private String status;

    private LocalDateTime assignedTime;

    private LocalDateTime approvedTime;

    private String action;

    private String comment;

    private Integer sortOrder;
}
