package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EWorkflowType {
    PURCHASE_ORDER("PURCHASE_ORDER", "采购订单审批"),
    CONTRACT("CONTRACT", "合同审批"),
    PAYMENT("PAYMENT", "付款审批"),
    EXPENSE("EXPENSE", "费用报销审批"),
    LEAVE("LEAVE", "请假审批"),
    CUSTOM("CUSTOM", "自定义审批");

    private final String code;
    private final String desc;

    public static EWorkflowType fromCode(String code) {
        for (EWorkflowType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown workflow type code: " + code);
    }
}
