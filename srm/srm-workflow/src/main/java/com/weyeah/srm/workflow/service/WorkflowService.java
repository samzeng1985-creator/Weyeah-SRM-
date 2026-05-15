package com.weyeah.srm.workflow.service;

import com.weyeah.srm.workflow.dto.WorkflowDefinitionCreateDTO;
import com.weyeah.srm.workflow.dto.WorkflowStartDTO;
import com.weyeah.srm.workflow.dto.WorkflowTaskActionDTO;
import com.weyeah.srm.workflow.entity.WorkflowDefinition;
import com.weyeah.srm.workflow.entity.WorkflowInstance;
import com.weyeah.srm.workflow.entity.WorkflowTask;

import java.util.List;

public interface WorkflowService {

    List<WorkflowDefinition> listDefinitions(String type);

    WorkflowDefinition getDefinitionById(Long id);

    WorkflowDefinition getDefinitionByCode(String code);

    Long createDefinition(WorkflowDefinitionCreateDTO createDTO);

    void updateDefinition(WorkflowDefinition definition);

    void enableDefinition(Long id);

    void disableDefinition(Long id);

    WorkflowInstance startWorkflow(WorkflowStartDTO startDTO);

    WorkflowInstance getInstanceById(Long id);

    WorkflowInstance getInstanceByBusiness(String businessType, Long businessId);

    List<WorkflowTask> getTasksByInstance(Long instanceId);

    List<WorkflowTask> getPendingTasks(Long assigneeId);

    void claimTask(Long taskId, Long assigneeId);

    void approveTask(WorkflowTaskActionDTO actionDTO);

    void rejectTask(WorkflowTaskActionDTO actionDTO);

    void cancelWorkflow(Long instanceId);

    void callback(Long instanceId, String feishuInstanceId);
}
