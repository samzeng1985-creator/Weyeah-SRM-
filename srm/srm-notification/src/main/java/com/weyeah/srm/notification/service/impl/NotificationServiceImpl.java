package com.weyeah.srm.notification.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.notification.dto.NotificationQueryDTO;
import com.weyeah.srm.notification.dto.NotificationSendDTO;
import com.weyeah.srm.notification.entity.NotificationMessage;
import com.weyeah.srm.notification.exception.MessageSendException;
import com.weyeah.srm.notification.mapper.NotificationMessageMapper;
import com.weyeah.srm.notification.service.NotificationService;
import com.weyeah.srm.notification.service.NotificationTemplateService;
import com.weyeah.srm.types.enums.EMessageChannel;
import com.weyeah.srm.types.enums.EMessageStatus;
import com.weyeah.srm.types.enums.ENotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationMessageMapper messageMapper;
    private final NotificationTemplateService templateService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public NotificationMessage send(NotificationSendDTO sendDTO) {
        NotificationMessage message = new NotificationMessage();
        message.setMessageNo(generateMessageNo());
        message.setType(ENotificationType.fromCode(sendDTO.getType()));
        message.setChannel(determineChannel(sendDTO.getRecipient()));
        message.setRecipient(sendDTO.getRecipient());
        message.setRecipientId(sendDTO.getRecipientId());
        message.setTitle(sendDTO.getTitle());
        message.setContent(sendDTO.getContent());
        message.setTemplateCode(sendDTO.getTemplateCode());
        message.setTemplateParams(sendDTO.getTemplateParams());
        message.setStatus(EMessageStatus.PENDING);
        message.setRetryCount(0);
        message.setCreateTime(LocalDateTime.now());

        messageMapper.insert(message);

        sendMessage(message);

        return message;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public NotificationMessage sendToSupplier(Long supplierId, String title, String content) {
        NotificationMessage message = new NotificationMessage();
        message.setMessageNo(generateMessageNo());
        message.setType(ENotificationType.MESSAGE);
        message.setChannel(EMessageChannel.WECHAT_WORK);
        message.setRecipientId(supplierId.toString());
        message.setTitle(title);
        message.setContent(content);
        message.setStatus(EMessageStatus.PENDING);
        message.setRetryCount(0);
        message.setCreateTime(LocalDateTime.now());

        messageMapper.insert(message);

        sendMessage(message);

        return message;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public NotificationMessage sendWorkflowNotification(
            String recipientId,
            String title,
            String content,
            String instanceNo) {
        NotificationMessage message = new NotificationMessage();
        message.setMessageNo(generateMessageNo());
        message.setType(ENotificationType.WORKFLOW);
        message.setChannel(EMessageChannel.FEISHU);
        message.setRecipientId(recipientId);
        message.setTitle(title);
        message.setContent(content + "\n实例编号: " + instanceNo);
        message.setStatus(EMessageStatus.PENDING);
        message.setRetryCount(0);
        message.setCreateTime(LocalDateTime.now());

        messageMapper.insert(message);

        sendMessage(message);

        return message;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public NotificationMessage sendOrderNotification(String recipientId, String title, String content, Long orderId) {
        NotificationMessage message = new NotificationMessage();
        message.setMessageNo(generateMessageNo());
        message.setType(ENotificationType.ORDER);
        message.setChannel(EMessageChannel.WECHAT_WORK);
        message.setRecipientId(recipientId);
        message.setTitle(title);
        message.setContent(content + "\n订单ID: " + orderId);
        message.setStatus(EMessageStatus.PENDING);
        message.setRetryCount(0);
        message.setCreateTime(LocalDateTime.now());

        messageMapper.insert(message);

        sendMessage(message);

        return message;
    }

    @Override
    public PageResult<NotificationMessage> queryPage(NotificationQueryDTO queryDTO) {
        Page<NotificationMessage> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());

        QueryWrapper<NotificationMessage> wrapper = new QueryWrapper<>();

        if (StringUtils.hasText(queryDTO.getRecipient())) {
            wrapper.eq("recipient_id", queryDTO.getRecipient());
        }

        if (StringUtils.hasText(queryDTO.getType())) {
            wrapper.eq("type", queryDTO.getType());
        }

        if (StringUtils.hasText(queryDTO.getStatus())) {
            wrapper.eq("status", queryDTO.getStatus());
        }

        wrapper.orderByDesc("create_time");

        Page<NotificationMessage> result = messageMapper.selectPage(page, wrapper);

        return PageResult.of(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public List<NotificationMessage> getByRecipient(String recipient) {
        QueryWrapper<NotificationMessage> wrapper = new QueryWrapper<>();
        wrapper.eq("recipient_id", recipient);
        wrapper.orderByDesc("create_time");
        return messageMapper.selectList(wrapper);
    }

    @Override
    public List<NotificationMessage> getUnread(String recipient) {
        QueryWrapper<NotificationMessage> wrapper = new QueryWrapper<>();
        wrapper.eq("recipient_id", recipient);
        wrapper.notIn("status", EMessageStatus.READ.getCode());
        wrapper.orderByDesc("create_time");
        return messageMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markAsRead(Long id) {
        NotificationMessage message = messageMapper.selectById(id);
        if (message == null) {
            throw new BizException(404, "消息不存在");
        }

        message.setStatus(EMessageStatus.READ);
        message.setReadTime(LocalDateTime.now());
        message.setUpdateTime(LocalDateTime.now());

        messageMapper.updateById(message);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markAllAsRead(String recipient) {
        QueryWrapper<NotificationMessage> wrapper = new QueryWrapper<>();
        wrapper.eq("recipient_id", recipient);
        wrapper.notIn("status", EMessageStatus.READ.getCode());

        NotificationMessage update = new NotificationMessage();
        update.setStatus(EMessageStatus.READ);
        update.setReadTime(LocalDateTime.now());
        update.setUpdateTime(LocalDateTime.now());

        messageMapper.update(update, wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void retrySend(Long id) {
        NotificationMessage message = messageMapper.selectById(id);
        if (message == null) {
            throw new BizException(404, "消息不存在");
        }

        if (message.getRetryCount() >= 3) {
            throw new BizException(400, "重试次数已达上限");
        }

        message.setStatus(EMessageStatus.PENDING);
        message.setRetryCount(message.getRetryCount() + 1);
        message.setUpdateTime(LocalDateTime.now());

        messageMapper.updateById(message);

        sendMessage(message);
    }

    private void sendMessage(NotificationMessage message) {
        message.setStatus(EMessageStatus.SENDING);
        message.setUpdateTime(LocalDateTime.now());
        messageMapper.updateById(message);

        try {
            String externalId = doSend(message);
            message.setExternalId(externalId);
            message.setStatus(EMessageStatus.SENT);
            message.setSentTime(LocalDateTime.now());
        } catch (MessageSendException e) {
            log.error("发送消息失败: {}", message.getMessageNo(), e);
            message.setStatus(EMessageStatus.FAILED);
            message.setErrorMessage(e.getMessage());
        }

        message.setUpdateTime(LocalDateTime.now());
        messageMapper.updateById(message);
    }

    private String doSend(NotificationMessage message) {
        return "MSG_" + System.currentTimeMillis();
    }

    private EMessageChannel determineChannel(String recipient) {
        if (recipient != null && recipient.matches("^\\d+$")) {
            return EMessageChannel.WECHAT_WORK;
        } else if (recipient != null && recipient.contains("@")) {
            return EMessageChannel.EMAIL;
        }
        return EMessageChannel.IN_APP;
    }

    private String generateMessageNo() {
        return "MSG" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
}
