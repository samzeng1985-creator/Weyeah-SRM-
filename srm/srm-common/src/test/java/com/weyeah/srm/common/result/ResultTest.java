package com.weyeah.srm.common.result;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ResultTest {

    @Test
    void success_shouldReturnDefaultSuccess_whenNoParameters() {
        Result<Void> result = Result.success();
        assertEquals(200, result.getCode());
        assertEquals("操作成功", result.getMessage());
        assertNull(result.getData());
        assertTrue(result.isSuccess());
    }

    @Test
    void success_shouldReturnSuccessWithData_whenDataProvided() {
        String data = "test data";
        Result<String> result = Result.success(data);
        assertEquals(200, result.getCode());
        assertEquals("操作成功", result.getMessage());
        assertEquals(data, result.getData());
        assertTrue(result.isSuccess());
    }

    @Test
    void success_shouldReturnSuccessWithCustomMessage_whenMessageAndDataProvided() {
        String message = "自定义成功消息";
        String data = "test data";
        Result<String> result = Result.success(message, data);
        assertEquals(200, result.getCode());
        assertEquals(message, result.getMessage());
        assertEquals(data, result.getData());
        assertTrue(result.isSuccess());
    }

    @Test
    void error_shouldReturnDefaultError_whenNoParameters() {
        Result<Void> result = Result.error();
        assertEquals(500, result.getCode());
        assertEquals("操作失败", result.getMessage());
        assertNull(result.getData());
        assertFalse(result.isSuccess());
    }

    @Test
    void error_shouldReturnErrorWithMessage_whenMessageProvided() {
        String message = "自定义错误消息";
        Result<Void> result = Result.error(message);
        assertEquals(500, result.getCode());
        assertEquals(message, result.getMessage());
        assertNull(result.getData());
        assertFalse(result.isSuccess());
    }

    @Test
    void error_shouldReturnErrorWithCustomCode_whenCodeAndMessageProvided() {
        int code = 400;
        String message = "参数错误";
        Result<Void> result = Result.error(code, message);
        assertEquals(code, result.getCode());
        assertEquals(message, result.getMessage());
        assertNull(result.getData());
        assertFalse(result.isSuccess());
    }

    @Test
    void isSuccess_shouldReturnTrue_whenCodeIs200() {
        Result<Void> result = Result.success();
        assertTrue(result.isSuccess());
    }

    @Test
    void isSuccess_shouldReturnFalse_whenCodeIsNot200() {
        Result<Void> result = Result.error();
        assertFalse(result.isSuccess());
    }

}
