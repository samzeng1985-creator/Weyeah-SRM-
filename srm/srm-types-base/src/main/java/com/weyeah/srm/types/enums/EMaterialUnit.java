package com.weyeah.srm.types.enums;

public enum EMaterialUnit {
    PIECE("PIECE", "个"),
    SET("SET", "套"),
    BOX("BOX", "盒"),
    TON("TON", "吨"),
    KILOGRAM("KILOGRAM", "千克"),
    METER("METER", "米"),
    SQUARE_METER("SQUARE_METER", "平方米"),
    LITER("LITER", "升"),
    PACKAGE("PACKAGE", "包");

    private final String code;
    private final String desc;

    EMaterialUnit(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    public static EMaterialUnit fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (EMaterialUnit unit : values()) {
            if (unit.code.equals(code)) {
                return unit;
            }
        }
        return null;
    }
}
