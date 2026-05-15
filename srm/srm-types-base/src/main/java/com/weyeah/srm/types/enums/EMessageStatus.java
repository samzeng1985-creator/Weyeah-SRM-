package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EMessageStatus {
    PENDING("PENDING", "待发送"),
    SENDING("SENDING", "发送中"),
    SENT("SENT", "已发送"),
    FAILED("FAILED", "发送失败"),
    READ("READ", "已读");

    private final String code;
    private final String desc;

    public static EMessageStatus fromCode(String code) {
        for (EMessageStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown message status code: " + code);
    }
}
