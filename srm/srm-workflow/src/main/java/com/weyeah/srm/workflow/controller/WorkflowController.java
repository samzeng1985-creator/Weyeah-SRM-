package com.weyeah.srm.workflow.controller;

import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.workflow.dto.WorkflowDefinitionCreateDTO;
import com.weyeah.srm.workflow.dto.WorkflowStartDTO;
import com.weyeah.srm.workflow.dto.WorkflowTaskActionDTO;
import com.weyeah.srm.workflow.entity.WorkflowDefinition;
import com.weyeah.srm.workflow.entity.WorkflowInstance;
import com.weyeah.srm.workflow.entity.WorkflowTask;
import com.weyeah.srm.workflow.service.WorkflowService;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "工作流管理", description = "审批流程相关接口")
@RestController
@RequestMapping("/api/workflow")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class WorkflowController {

    private final WorkflowService workflowService;

    @Operation(summary = "获取流程定义列表")
    @GetMapping("/definitions")
    public Result<List<WorkflowDefinition>> listDefinitions(@RequestParam(required = false) String type) {
        List<WorkflowDefinition> definitions = workflowService.listDefinitions(type);
        return Result.success(definitions);
    }

    @Operation(summary = "获取流程定义详情")
    @GetMapping("/definitions/{id}")
    public Result<WorkflowDefinition> getDefinition(@PathVariable Long id) {
        WorkflowDefinition definition = workflowService.getDefinitionById(id);
        return Result.success(definition);
    }

    @Operation(summary = "根据编码获取流程定义")
    @GetMapping("/definitions/code/{code}")
    public Result<WorkflowDefinition> getDefinitionByCode(@PathVariable String code) {
        WorkflowDefinition definition = workflowService.getDefinitionByCode(code);
        return Result.success(definition);
    }

    @Operation(summary = "创建流程定义")
    @PostMapping("/definitions")
    public Result<Long> createDefinition(@Valid @RequestBody WorkflowDefinitionCreateDTO createDTO) {
        Long id = workflowService.createDefinition(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "启用流程")
    @PostMapping("/definitions/{id}/enable")
    public Result<Void> enableDefinition(@PathVariable Long id) {
        workflowService.enableDefinition(id);
        return Result.success();
    }

    @Operation(summary = "禁用流程")
    @PostMapping("/definitions/{id}/disable")
    public Result<Void> disableDefinition(@PathVariable Long id) {
        workflowService.disableDefinition(id);
        return Result.success();
    }

    @Operation(summary = "发起流程")
    @PostMapping("/instances")
    public Result<Long> startWorkflow(@Valid @RequestBody WorkflowStartDTO startDTO) {
        WorkflowInstance instance = workflowService.startWorkflow(startDTO);
        return Result.success(instance.getId());
    }

    @Operation(summary = "获取流程实例")
    @GetMapping("/instances/{id}")
    public Result<WorkflowInstance> getInstance(@PathVariable Long id) {
        WorkflowInstance instance = workflowService.getInstanceById(id);
        return Result.success(instance);
    }

    @Operation(summary = "根据业务获取流程实例")
    @GetMapping("/instances/business")
    public Result<WorkflowInstance> getInstanceByBusiness(
            @RequestParam String businessType,
            @RequestParam Long businessId) {
        WorkflowInstance instance = workflowService.getInstanceByBusiness(businessType, businessId);
        return Result.success(instance);
    }

    @Operation(summary = "获取流程任务列表")
    @GetMapping("/instances/{instanceId}/tasks")
    public Result<List<WorkflowTask>> getTasksByInstance(@PathVariable Long instanceId) {
        List<WorkflowTask> tasks = workflowService.getTasksByInstance(instanceId);
        return Result.success(tasks);
    }

    @Operation(summary = "获取待办任务")
    @GetMapping("/tasks/pending")
    public Result<List<WorkflowTask>> getPendingTasks(@RequestParam Long assigneeId) {
        List<WorkflowTask> tasks = workflowService.getPendingTasks(assigneeId);
        return Result.success(tasks);
    }

    @Operation(summary = "签收任务")
    @PostMapping("/tasks/{taskId}/claim")
    public Result<Void> claimTask(@PathVariable Long taskId, @RequestParam Long assigneeId) {
        workflowService.claimTask(taskId, assigneeId);
        return Result.success();
    }

    @Operation(summary = "审批通过")
    @PostMapping("/tasks/approve")
    public Result<Void> approveTask(@Valid @RequestBody WorkflowTaskActionDTO actionDTO) {
        workflowService.approveTask(actionDTO);
        return Result.success();
    }

    @Operation(summary = "审批拒绝")
    @PostMapping("/tasks/reject")
    public Result<Void> rejectTask(@Valid @RequestBody WorkflowTaskActionDTO actionDTO) {
        workflowService.rejectTask(actionDTO);
        return Result.success();
    }

    @Operation(summary = "取消流程")
    @PostMapping("/instances/{instanceId}/cancel")
    public Result<Void> cancelWorkflow(@PathVariable Long instanceId) {
        workflowService.cancelWorkflow(instanceId);
        return Result.success();
    }

    @Operation(summary = "飞书回调")
    @PostMapping("/instances/{instanceId}/callback")
    public Result<Void> callback(@PathVariable Long instanceId, @RequestParam String feishuInstanceId) {
        workflowService.callback(instanceId, feishuInstanceId);
        return Result.success();
    }
}
