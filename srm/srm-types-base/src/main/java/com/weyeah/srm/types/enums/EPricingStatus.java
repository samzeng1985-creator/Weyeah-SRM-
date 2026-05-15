package com.weyeah.srm.types.enums;

public enum EPricingStatus {
    DRAFT("DRAFT", "草稿"),
    PENDING_APPROVAL("PENDING_APPROVAL", "待审批"),
    ACTIVE("ACTIVE", "生效中"),
    EXPIRED("EXPIRED", "已过期"),
    CANCELLED("CANCELLED", "已取消");

    private final String code;
    private final String desc;

    EPricingStatus(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    public static EPricingStatus fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (EPricingStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return null;
    }
}
