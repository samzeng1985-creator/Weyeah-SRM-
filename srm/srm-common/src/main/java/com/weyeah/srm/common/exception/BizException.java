package com.weyeah.srm.common.exception;

import lombok.Getter;

@Getter
public class BizException extends RuntimeException {

    private static final int DEFAULT_ERROR_CODE = 500;

    private final int code;

    public BizException(String message) {
        super(message);
        this.code = DEFAULT_ERROR_CODE;
    }

    public BizException(int code, String message) {
        super(message);
        this.code = code;
    }

    public BizException(String message, Throwable cause) {
        super(message, cause);
        this.code = DEFAULT_ERROR_CODE;
    }

}
