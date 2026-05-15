package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EDeliveryStatus {
    PENDING("PENDING", "待发货"),
    IN_TRANSIT("IN_TRANSIT", "运输中"),
    PARTIALLY_ARRIVED("PARTIALLY_ARRIVED", "部分到达"),
    ARRIVED("ARRIVED", "已到达"),
    RECEIVED("RECEIVED", "已收货");

    private final String code;
    private final String desc;

    public static EDeliveryStatus fromCode(String code) {
        for (EDeliveryStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown delivery status code: " + code);
    }
}
