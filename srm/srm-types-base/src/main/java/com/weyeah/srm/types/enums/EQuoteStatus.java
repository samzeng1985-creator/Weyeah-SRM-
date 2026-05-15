package com.weyeah.srm.types.enums;

public enum EQuoteStatus {
    DRAFT("DRAFT", "草稿"),
    SUBMITTED("SUBMITTED", "已提交"),
    QUOTED("QUOTED", "已报价"),
    ACCEPTED("ACCEPTED", "已接受"),
    REJECTED("REJECTED", "已拒绝"),
    EXPIRED("EXPIRED", "已过期");

    private final String code;
    private final String desc;

    EQuoteStatus(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    public static EQuoteStatus fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (EQuoteStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return null;
    }
}
