package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ESupplierType {
    DOMESTIC("DOMESTIC", "国内供应商"),
    OVERSEAS("OVERSEAS", "海外供应商"),
    PROCESSOR("PROCESSOR", "代工厂");

    private final String code;
    private final String desc;

    public static ESupplierType fromCode(String code) {
        for (ESupplierType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown supplier type code: " + code);
    }
}