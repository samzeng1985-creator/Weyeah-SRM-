package com.weyeah.srm.common.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BizExceptionTest {

    @Test
    void constructor_shouldSetCodeToDefault_whenOnlyMessageProvided() {
        String message = "业务异常消息";
        BizException exception = new BizException(message);
        assertEquals(500, exception.getCode());
        assertEquals(message, exception.getMessage());
    }

    @Test
    void constructor_shouldSetCustomCodeAndMessage_whenCodeAndMessageProvided() {
        int code = 400;
        String message = "自定义业务异常";
        BizException exception = new BizException(code, message);
        assertEquals(code, exception.getCode());
        assertEquals(message, exception.getMessage());
    }

    @Test
    void constructor_shouldSetDefaultCodeAndCause_whenMessageAndCauseProvided() {
        String message = "异常消息";
        Throwable cause = new RuntimeException("原始异常");
        BizException exception = new BizException(message, cause);
        assertEquals(500, exception.getCode());
        assertEquals(message, exception.getMessage());
        assertEquals(cause, exception.getCause());
    }

    @Test
    void getCode_shouldReturnCorrectCode_whenExceptionCreated() {
        int code = 404;
        BizException exception = new BizException(code, "未找到");
        assertEquals(code, exception.getCode());
    }

}
