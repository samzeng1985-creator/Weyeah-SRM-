package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EPurchaseType {
    STANDARD("STANDARD", "标准采购"),
    URGENT("URGENT", "紧急采购"),
    SPOT("SPOT", "现货采购"),
    BLANKET("BLANKET", "框架协议采购");

    private final String code;
    private final String desc;

    public static EPurchaseType fromCode(String code) {
        for (EPurchaseType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown purchase type code: " + code);
    }
}
