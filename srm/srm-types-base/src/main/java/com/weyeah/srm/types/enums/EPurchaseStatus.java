package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EPurchaseStatus {
    DRAFT("DRAFT", "草稿"),
    PENDING_APPROVAL("PENDING_APPROVAL", "待审批"),
    APPROVED("APPROVED", "已审批"),
    PENDING_SUPPLIER_CONFIRM("PENDING_SUPPLIER_CONFIRM", "待供应商确认"),
    SUPPLIER_CONFIRMED("SUPPLIER_CONFIRMED", "供应商已确认"),
    IN_PRODUCTION("IN_PRODUCTION", "生产中"),
    PARTIALLY_DELIVERED("PARTIALLY_DELIVERED", "部分交货"),
    DELIVERED("DELIVERED", "已交货"),
    PARTIALLY_RECEIVED("PARTIALLY_RECEIVED", "部分收货"),
    RECEIVED("RECEIVED", "已收货"),
    COMPLETED("COMPLETED", "已完成"),
    CANCELLED("CANCELLED", "已取消"),
    REJECTED("REJECTED", "已拒绝");

    private final String code;
    private final String desc;

    public static EPurchaseStatus fromCode(String code) {
        for (EPurchaseStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown purchase status code: " + code);
    }
}
