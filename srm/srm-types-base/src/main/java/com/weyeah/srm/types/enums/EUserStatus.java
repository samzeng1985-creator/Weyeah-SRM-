package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EUserStatus {
    ACTIVE("ACTIVE", "正常"),
    INACTIVE("INACTIVE", "禁用"),
    LOCKED("LOCKED", "锁定");

    private final String code;
    private final String desc;

    public static EUserStatus fromCode(String code) {
        for (EUserStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown user status code: " + code);
    }
}
