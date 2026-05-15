package com.weyeah.srm.types.enums;

public enum EMaterialStatus {
    ACTIVE("ACTIVE", "启用"),
    INACTIVE("INACTIVE", "禁用"),
    OBSOLETE("OBSOLETE", "淘汰");

    private final String code;
    private final String desc;

    EMaterialStatus(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    public static EMaterialStatus fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (EMaterialStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return null;
    }
}
