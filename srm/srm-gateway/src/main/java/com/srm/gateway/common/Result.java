package com.srm.gateway.common;

import java.io.Serializable;

public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private static final int SUCCESS_CODE = 200;
    private static final String SUCCESS_MESSAGE = "操作成功";
    private static final int ERROR_CODE = 500;
    private static final String ERROR_MESSAGE = "操作失败";

    private int code;
    private String message;
    private T data;
    private boolean success;

    public Result() {
    }

    public Result(int code, String message, T data, boolean success) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.success = success;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public boolean isSuccess() {
        return this.code == SUCCESS_CODE;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public static <T> Result<T> success() {
        Result<T> result = new Result<>();
        result.setCode(SUCCESS_CODE);
        result.setMessage(SUCCESS_MESSAGE);
        result.setSuccess(true);
        return result;
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(SUCCESS_CODE);
        result.setMessage(SUCCESS_MESSAGE);
        result.setData(data);
        result.setSuccess(true);
        result.success = true;
        return result;
    }

    public static <T> Result<T> success(String message, T data) {
        Result<T> result = new Result<>();
        result.setCode(SUCCESS_CODE);
        result.setMessage(message);
        result.setData(data);
        result.setSuccess(true);
        result.success = true;
        return result;
    }

    public static <T> Result<T> error() {
        Result<T> result = new Result<>();
        result.setCode(ERROR_CODE);
        result.setMessage(ERROR_MESSAGE);
        result.setSuccess(false);
        return result;
    }

    public static <T> Result<T> error(String message) {
        Result<T> result = new Result<>();
        result.setCode(ERROR_CODE);
        result.setMessage(message);
        result.setSuccess(false);
        return result;
    }

    public static <T> Result<T> error(int code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        result.setSuccess(false);
        return result;
    }
}
