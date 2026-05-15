package com.weyeah.srm.notification;

import com.weyeah.srm.notification.dto.NotificationSendDTO;
import com.weyeah.srm.notification.entity.NotificationMessage;
import com.weyeah.srm.notification.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;

    @Test
    void testSendNotification() {
        NotificationSendDTO sendDTO = new NotificationSendDTO();
        sendDTO.setType("SYSTEM");
        sendDTO.setRecipient("user001");
        sendDTO.setRecipientId("1");
        sendDTO.setTitle("测试通知");
        sendDTO.setContent("这是一条测试通知消息");

        NotificationMessage message = notificationService.send(sendDTO);

        assertNotNull(message);
        assertNotNull(message.getMessageNo());
    }

    @Test
    void testSendToSupplier() {
        NotificationMessage message = notificationService.sendToSupplier(
                1L,
                "新订单提醒",
                "您有一个新的采购订单需要确认"
        );

        assertNotNull(message);
        assertEquals("MESSAGE", message.getType().getCode());
    }

    @Test
    void testSendWorkflowNotification() {
        NotificationMessage message = notificationService.sendWorkflowNotification(
                "user001",
                "审批通知",
                "您有一个新的采购订单需要审批",
                "WF20240101001"
        );

        assertNotNull(message);
        assertEquals("WORKFLOW", message.getType().getCode());
    }

    @Test
    void testGetUnread() {
        NotificationSendDTO sendDTO = new NotificationSendDTO();
        sendDTO.setType("SYSTEM");
        sendDTO.setRecipient("user002");
        sendDTO.setRecipientId("2");
        sendDTO.setTitle("未读测试");
        sendDTO.setContent("测试未读消息");

        notificationService.send(sendDTO);

        var unread = notificationService.getUnread("2");

        assertNotNull(unread);
    }

    @Test
    void testMarkAsRead() {
        NotificationSendDTO sendDTO = new NotificationSendDTO();
        sendDTO.setType("SYSTEM");
        sendDTO.setRecipient("user003");
        sendDTO.setRecipientId("3");
        sendDTO.setTitle("已读测试");
        sendDTO.setContent("测试标记已读");

        NotificationMessage message = notificationService.send(sendDTO);

        notificationService.markAsRead(message.getId());

        var messages = notificationService.getUnread("3");

        assertTrue(messages.isEmpty() || messages.stream()
                .noneMatch(m -> m.getId().equals(message.getId())));
    }
}
