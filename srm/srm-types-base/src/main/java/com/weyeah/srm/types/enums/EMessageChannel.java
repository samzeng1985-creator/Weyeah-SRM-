package com.weyeah.srm.types.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EMessageChannel {
    FEISHU("FEISHU", "飞书"),
    WECHAT_WORK("WECHAT_WORK", "企业微信"),
    EMAIL("EMAIL", "邮件"),
    SMS("SMS", "短信"),
    IN_APP("IN_APP", "站内信");

    private final String code;
    private final String desc;

    public static EMessageChannel fromCode(String code) {
        for (EMessageChannel channel : values()) {
            if (channel.code.equals(code)) {
                return channel;
            }
        }
        throw new IllegalArgumentException("Unknown message channel code: " + code);
    }
}
