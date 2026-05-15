package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EContractStatus {
    DRAFT("DRAFT", "草稿"),
    PENDING_REVIEW("PENDING_REVIEW", "待审核"),
    APPROVED("APPROVED", "已审核"),
    PENDING_SIGN("PENDING_SIGN", "待签署"),
    SIGNED("SIGNED", "已签署"),
    EXPIRED("EXPIRED", "已过期"),
    TERMINATED("TERMINATED", "已终止");

    private final String code;
    private final String desc;

    public static EContractStatus fromCode(String code) {
        for (EContractStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown contract status code: " + code);
    }
}