package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ESupplierStatus {
    DRAFT("DRAFT", "草稿"),
    PENDING_REVIEW("PENDING_REVIEW", "待审核"),
    ACTIVE("ACTIVE", "已生效"),
    FROZEN("FROZEN", "已冻结"),
    TERMINATED("TERMINATED", "已终止");

    private final String code;
    private final String desc;

    public static ESupplierStatus fromCode(String code) {
        for (ESupplierStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown supplier status code: " + code);
    }
}