package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EContractType {
    NDA("NDA", "保密协议"),
    PURCHASE("PURCHASE", "采购合同"),
    PROCESSING("PROCESSING", "委托加工合同");

    private final String code;
    private final String desc;

    public static EContractType fromCode(String code) {
        for (EContractType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown contract type code: " + code);
    }
}