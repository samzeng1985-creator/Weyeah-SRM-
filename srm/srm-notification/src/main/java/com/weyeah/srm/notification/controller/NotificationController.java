package com.weyeah.srm.notification.controller;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.notification.dto.NotificationQueryDTO;
import com.weyeah.srm.notification.dto.NotificationSendDTO;
import com.weyeah.srm.notification.entity.NotificationMessage;
import com.weyeah.srm.notification.service.NotificationService;
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

@Tag(name = "消息通知", description = "消息通知相关接口")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "发送通知")
    @PostMapping("/send")
    public Result<NotificationMessage> send(@Valid @RequestBody NotificationSendDTO sendDTO) {
        NotificationMessage message = notificationService.send(sendDTO);
        return Result.success(message);
    }

    @Operation(summary = "发送通知给供应商")
    @PostMapping("/send/supplier/{supplierId}")
    public Result<NotificationMessage> sendToSupplier(
            @PathVariable Long supplierId,
            @RequestParam String title,
            @RequestParam String content) {
        NotificationMessage message = notificationService.sendToSupplier(supplierId, title, content);
        return Result.success(message);
    }

    @Operation(summary = "发送审批通知")
    @PostMapping("/send/workflow")
    public Result<NotificationMessage> sendWorkflowNotification(
            @RequestParam String recipientId,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam String instanceNo) {
        NotificationMessage message =
                notificationService.sendWorkflowNotification(
                        recipientId, title, content, instanceNo);
        return Result.success(message);
    }

    @Operation(summary = "发送订单通知")
    @PostMapping("/send/order")
    public Result<NotificationMessage> sendOrderNotification(
            @RequestParam String recipientId,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam Long orderId) {
        NotificationMessage message = notificationService.sendOrderNotification(recipientId, title, content, orderId);
        return Result.success(message);
    }

    @Operation(summary = "分页查询通知")
    @GetMapping
    public Result<PageResult<NotificationMessage>> queryPage(NotificationQueryDTO queryDTO) {
        PageResult<NotificationMessage> page = notificationService.queryPage(queryDTO);
        return Result.success(page);
    }

    @Operation(summary = "获取用户的通知列表")
    @GetMapping("/recipient/{recipient}")
    public Result<List<NotificationMessage>> getByRecipient(@PathVariable String recipient) {
        List<NotificationMessage> messages = notificationService.getByRecipient(recipient);
        return Result.success(messages);
    }

    @Operation(summary = "获取用户的未读通知")
    @GetMapping("/recipient/{recipient}/unread")
    public Result<List<NotificationMessage>> getUnread(@PathVariable String recipient) {
        List<NotificationMessage> messages = notificationService.getUnread(recipient);
        return Result.success(messages);
    }

    @Operation(summary = "标记通知为已读")
    @PostMapping("/{id}/read")
    public Result<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return Result.success();
    }

    @Operation(summary = "标记所有通知为已读")
    @PostMapping("/recipient/{recipient}/read-all")
    public Result<Void> markAllAsRead(@PathVariable String recipient) {
        notificationService.markAllAsRead(recipient);
        return Result.success();
    }

    @Operation(summary = "重试发送")
    @PostMapping("/{id}/retry")
    public Result<Void> retrySend(@PathVariable Long id) {
        notificationService.retrySend(id);
        return Result.success();
    }
}
