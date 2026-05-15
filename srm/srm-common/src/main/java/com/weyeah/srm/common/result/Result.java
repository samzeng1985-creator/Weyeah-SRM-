package com.weyeah.srm.common.result;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private static final int SUCCESS_CODE = 200;
    private static final String SUCCESS_MESSAGE = "操作成功";
    private static final int ERROR_CODE = 500;
    private static final String ERROR_MESSAGE = "操作失败";

    private int code;
    private String message;
    private T data;

    public static <T> Result<T> success() {
        return Result.<T>builder()
                .code(SUCCESS_CODE)
                .message(SUCCESS_MESSAGE)
                .build();
    }

    public static <T> Result<T> success(T data) {
        return Result.<T>builder()
                .code(SUCCESS_CODE)
                .message(SUCCESS_MESSAGE)
                .data(data)
                .build();
    }

    public static <T> Result<T> success(String message, T data) {
        return Result.<T>builder()
                .code(SUCCESS_CODE)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> Result<T> error() {
        return Result.<T>builder()
                .code(ERROR_CODE)
                .message(ERROR_MESSAGE)
                .build();
    }

    public static <T> Result<T> error(String message) {
        return Result.<T>builder()
                .code(ERROR_CODE)
                .message(message)
                .build();
    }

    public static <T> Result<T> error(int code, String message) {
        return Result.<T>builder()
                .code(code)
                .message(message)
                .build();
    }

    public boolean isSuccess() {
        return this.code == SUCCESS_CODE;
    }

}