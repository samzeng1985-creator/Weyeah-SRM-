package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EOrgType {
    COMPANY("COMPANY", "公司"),
    DEPARTMENT("DEPARTMENT", "部门"),
    GROUP("GROUP", "小组");

    private final String code;
    private final String desc;

    public static EOrgType fromCode(String code) {
        for (EOrgType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown org type code: " + code);
    }
}
