package com.weyeah.srm.notification.dto;

import lombok.Data;

@Data
public class NotificationQueryDTO {

    private String recipient;

    private String type;

    private String status;

    private Integer pageNum = 1;

    private Integer pageSize = 10;
}
