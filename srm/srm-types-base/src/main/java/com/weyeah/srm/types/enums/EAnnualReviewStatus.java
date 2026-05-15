package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EAnnualReviewStatus {
    PENDING("PENDING", "待年审"),
    IN_PROGRESS("IN_PROGRESS", "年审中"),
    PASSED("PASSED", "年审通过"),
    FAILED("FAILED", "年审未通过");

    private final String code;
    private final String desc;

    public static EAnnualReviewStatus fromCode(String code) {
        for (EAnnualReviewStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown annual review status code: " + code);
    }
}