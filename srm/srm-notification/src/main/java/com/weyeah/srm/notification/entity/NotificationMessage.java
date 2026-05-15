package com.weyeah.srm.notification.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.core.domain.BaseEntity;
import com.weyeah.srm.types.enums.EMessageChannel;
import com.weyeah.srm.types.enums.EMessageStatus;
import com.weyeah.srm.types.enums.ENotificationType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("notification_message")
public class NotificationMessage extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String messageNo;

    private ENotificationType type;

    private EMessageChannel channel;

    private String recipient;

    private String recipientId;

    private String title;

    private String content;

    private String templateCode;

    private String templateParams;

    private EMessageStatus status;

    private LocalDateTime sentTime;

    private LocalDateTime readTime;

    private String externalId;

    private String externalResponse;

    private Integer retryCount;

    private String errorMessage;
}
