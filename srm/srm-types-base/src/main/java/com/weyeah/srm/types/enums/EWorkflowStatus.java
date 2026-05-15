package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EWorkflowStatus {
    DRAFT("DRAFT", "草稿"),
    PENDING("PENDING", "待审批"),
    APPROVING("APPROVING", "审批中"),
    APPROVED("APPROVED", "已通过"),
    REJECTED("REJECTED", "已拒绝"),
    CANCELLED("CANCELLED", "已取消");

    private final String code;
    private final String desc;

    public static EWorkflowStatus fromCode(String code) {
        for (EWorkflowStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown workflow status code: " + code);
    }
}
