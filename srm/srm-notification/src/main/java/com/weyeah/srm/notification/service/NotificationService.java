package com.weyeah.srm.notification.service;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.notification.dto.NotificationQueryDTO;
import com.weyeah.srm.notification.dto.NotificationSendDTO;
import com.weyeah.srm.notification.entity.NotificationMessage;

import java.util.List;

public interface NotificationService {

    NotificationMessage send(NotificationSendDTO sendDTO);

    NotificationMessage sendToSupplier(Long supplierId, String title, String content);

    NotificationMessage sendWorkflowNotification(String recipientId, String title, String content, String instanceNo);

    NotificationMessage sendOrderNotification(String recipientId, String title, String content, Long orderId);

    PageResult<NotificationMessage> queryPage(NotificationQueryDTO queryDTO);

    List<NotificationMessage> getByRecipient(String recipient);

    List<NotificationMessage> getUnread(String recipient);

    void markAsRead(Long id);

    void markAllAsRead(String recipient);

    void retrySend(Long id);
}
