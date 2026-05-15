package com.weyeah.srm.workflow.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.workflow.dto.WorkflowDefinitionCreateDTO;
import com.weyeah.srm.workflow.dto.WorkflowStartDTO;
import com.weyeah.srm.workflow.dto.WorkflowTaskActionDTO;
import com.weyeah.srm.workflow.entity.WorkflowDefinition;
import com.weyeah.srm.workflow.entity.WorkflowInstance;
import com.weyeah.srm.workflow.entity.WorkflowTask;
import com.weyeah.srm.workflow.mapper.WorkflowDefinitionMapper;
import com.weyeah.srm.workflow.mapper.WorkflowInstanceMapper;
import com.weyeah.srm.workflow.mapper.WorkflowTaskMapper;
import com.weyeah.srm.workflow.service.WorkflowService;
import com.weyeah.srm.types.enums.EWorkflowStatus;
import com.weyeah.srm.types.enums.EWorkflowType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkflowServiceImpl implements WorkflowService {

    private final WorkflowDefinitionMapper definitionMapper;
    private final WorkflowInstanceMapper instanceMapper;
    private final WorkflowTaskMapper taskMapper;

    @Override
    public List<WorkflowDefinition> listDefinitions(String type) {
        QueryWrapper<WorkflowDefinition> wrapper = new QueryWrapper<>();
        if (type != null) {
            wrapper.eq("type", type);
        }
        wrapper.eq("is_active", true);
        wrapper.orderByDesc("create_time");
        return definitionMapper.selectList(wrapper);
    }

    @Override
    public WorkflowDefinition getDefinitionByCode(String code) {
        QueryWrapper<WorkflowDefinition> wrapper = new QueryWrapper<>();
        wrapper.eq("code", code);
        wrapper.eq("is_active", true);
        return definitionMapper.selectOne(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createDefinition(WorkflowDefinitionCreateDTO createDTO) {
        WorkflowDefinition definition = new WorkflowDefinition();
        BeanUtils.copyProperties(createDTO, definition);
        definition.setType(EWorkflowType.fromCode(createDTO.getType()));
        if (definition.getIsActive() == null) {
            definition.setIsActive(false);
        }
        definition.setVersion(1);
        definition.setCreateTime(LocalDateTime.now());
        definitionMapper.insert(definition);
        return definition.getId();
    }

    @Override
    public WorkflowDefinition getDefinitionById(Long id) {
        return definitionMapper.selectById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateDefinition(WorkflowDefinition definition) {
        WorkflowDefinition exist = definitionMapper.selectById(definition.getId());
        if (exist == null) {
            throw new BizException(404, "流程定义不存在");
        }
        definition.setUpdateTime(LocalDateTime.now());
        definitionMapper.updateById(definition);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enableDefinition(Long id) {
        WorkflowDefinition definition = definitionMapper.selectById(id);
        if (definition == null) {
            throw new BizException(404, "流程定义不存在");
        }
        definition.setIsActive(true);
        definition.setUpdateTime(LocalDateTime.now());
        definitionMapper.updateById(definition);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disableDefinition(Long id) {
        WorkflowDefinition definition = definitionMapper.selectById(id);
        if (definition == null) {
            throw new BizException(404, "流程定义不存在");
        }
        definition.setIsActive(false);
        definition.setUpdateTime(LocalDateTime.now());
        definitionMapper.updateById(definition);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WorkflowInstance startWorkflow(WorkflowStartDTO startDTO) {
        WorkflowDefinition definition = definitionMapper.selectById(startDTO.getDefinitionId());
        if (definition == null) {
            throw new BizException(404, "流程定义不存在");
        }

        WorkflowInstance instance = new WorkflowInstance();
        instance.setInstanceNo(generateInstanceNo());
        instance.setDefinitionId(startDTO.getDefinitionId());
        instance.setBusinessType(startDTO.getBusinessType());
        instance.setBusinessId(startDTO.getBusinessId());
        instance.setBusinessData(startDTO.getBusinessData());
        instance.setStatus(EWorkflowStatus.PENDING);
        instance.setApplicantId(startDTO.getApplicantId());
        instance.setApplicantName(startDTO.getApplicantName());
        instance.setSubmitTime(LocalDateTime.now());
        instance.setCreateTime(LocalDateTime.now());

        instanceMapper.insert(instance);

        WorkflowTask firstTask = new WorkflowTask();
        firstTask.setInstanceId(instance.getId());
        firstTask.setNodeKey("start");
        firstTask.setNodeName("发起人");
        firstTask.setAssigneeId(startDTO.getApplicantId());
        firstTask.setAssigneeName(startDTO.getApplicantName());
        firstTask.setStatus("PENDING");
        firstTask.setAssignedTime(LocalDateTime.now());
        firstTask.setSortOrder(1);
        firstTask.setCreateTime(LocalDateTime.now());
        taskMapper.insert(firstTask);

        return instance;
    }

    @Override
    public WorkflowInstance getInstanceById(Long id) {
        return instanceMapper.selectById(id);
    }

    @Override
    public WorkflowInstance getInstanceByBusiness(String businessType, Long businessId) {
        QueryWrapper<WorkflowInstance> wrapper = new QueryWrapper<>();
        wrapper.eq("business_type", businessType);
        wrapper.eq("business_id", businessId);
        return instanceMapper.selectOne(wrapper);
    }

    @Override
    public List<WorkflowTask> getTasksByInstance(Long instanceId) {
        QueryWrapper<WorkflowTask> wrapper = new QueryWrapper<>();
        wrapper.eq("instance_id", instanceId);
        wrapper.orderByAsc("sort_order");
        return taskMapper.selectList(wrapper);
    }

    @Override
    public List<WorkflowTask> getPendingTasks(Long assigneeId) {
        QueryWrapper<WorkflowTask> wrapper = new QueryWrapper<>();
        wrapper.eq("assignee_id", assigneeId);
        wrapper.eq("status", "PENDING");
        wrapper.orderByAsc("assigned_time");
        return taskMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void claimTask(Long taskId, Long assigneeId) {
        WorkflowTask task = taskMapper.selectById(taskId);
        if (task == null) {
            throw new BizException(404, "任务不存在");
        }
        task.setAssigneeId(assigneeId);
        task.setUpdateTime(LocalDateTime.now());
        taskMapper.updateById(task);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void approveTask(WorkflowTaskActionDTO actionDTO) {
        WorkflowTask task = taskMapper.selectById(actionDTO.getTaskId());
        if (task == null) {
            throw new BizException(404, "任务不存在");
        }

        task.setStatus("APPROVED");
        task.setAction(actionDTO.getAction());
        task.setComment(actionDTO.getComment());
        task.setApprovedTime(LocalDateTime.now());
        task.setUpdateTime(LocalDateTime.now());
        taskMapper.updateById(task);

        WorkflowInstance instance = instanceMapper.selectById(task.getInstanceId());
        instance.setStatus(EWorkflowStatus.APPROVED);
        instance.setCompleteTime(LocalDateTime.now());
        instance.setUpdateTime(LocalDateTime.now());
        instanceMapper.updateById(instance);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void rejectTask(WorkflowTaskActionDTO actionDTO) {
        WorkflowTask task = taskMapper.selectById(actionDTO.getTaskId());
        if (task == null) {
            throw new BizException(404, "任务不存在");
        }

        task.setStatus("REJECTED");
        task.setAction(actionDTO.getAction());
        task.setComment(actionDTO.getComment());
        task.setApprovedTime(LocalDateTime.now());
        task.setUpdateTime(LocalDateTime.now());
        taskMapper.updateById(task);

        WorkflowInstance instance = instanceMapper.selectById(task.getInstanceId());
        instance.setStatus(EWorkflowStatus.REJECTED);
        instance.setCompleteTime(LocalDateTime.now());
        instance.setUpdateTime(LocalDateTime.now());
        instanceMapper.updateById(instance);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelWorkflow(Long instanceId) {
        WorkflowInstance instance = instanceMapper.selectById(instanceId);
        if (instance == null) {
            throw new BizException(404, "流程实例不存在");
        }
        instance.setStatus(EWorkflowStatus.CANCELLED);
        instance.setUpdateTime(LocalDateTime.now());
        instanceMapper.updateById(instance);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void callback(Long instanceId, String feishuInstanceId) {
        WorkflowInstance instance = instanceMapper.selectById(instanceId);
        if (instance == null) {
            throw new BizException(404, "流程实例不存在");
        }
        instance.setFeishuInstanceId(feishuInstanceId);
        instance.setUpdateTime(LocalDateTime.now());
        instanceMapper.updateById(instance);
    }

    private String generateInstanceNo() {
        return "WF" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
}
