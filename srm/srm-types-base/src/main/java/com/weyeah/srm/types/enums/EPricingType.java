package com.weyeah.srm.types.enums;

public enum EPricingType {
    STANDARD("STANDARD", "标准定价"),
    CONTRACT("CONTRACT", "合同定价"),
    PROMOTION("PROMOTION", "促销定价"),
    VOLUME("VOLUME", "批量定价"),
    CUSTOM("CUSTOM", "自定义定价");

    private final String code;
    private final String desc;

    EPricingType(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    public static EPricingType fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (EPricingType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        return null;
    }
}
