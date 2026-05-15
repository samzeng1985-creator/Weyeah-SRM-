package com.weyeah.srm.types.enums;

public enum ECategoryStatus {
    ACTIVE("ACTIVE", "启用"),
    INACTIVE("INACTIVE", "禁用");

    private final String code;
    private final String desc;

    ECategoryStatus(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    public static ECategoryStatus fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (ECategoryStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return null;
    }
}
