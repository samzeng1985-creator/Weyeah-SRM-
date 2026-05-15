package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ENotificationType {
    SYSTEM("SYSTEM", "系统通知"),
    WORKFLOW("WORKFLOW", "审批通知"),
    ORDER("ORDER", "订单通知"),
    DELIVERY("DELIVERY", "交货通知"),
    MESSAGE("MESSAGE", "消息通知"),
    ALERT("ALERT", "预警通知");

    private final String code;
    private final String desc;

    public static ENotificationType fromCode(String code) {
        for (ENotificationType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown notification type code: " + code);
    }
}
