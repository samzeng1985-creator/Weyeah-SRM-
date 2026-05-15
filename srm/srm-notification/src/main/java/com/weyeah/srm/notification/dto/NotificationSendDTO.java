package com.weyeah.srm.notification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NotificationSendDTO {

    @NotBlank(message = "通知类型不能为空")
    private String type;

    @NotBlank(message = "接收者不能为空")
    private String recipient;

    private String recipientId;

    @NotBlank(message = "标题不能为空")
    private String title;

    @NotBlank(message = "内容不能为空")
    private String content;

    private String templateCode;

    private String templateParams;
}
