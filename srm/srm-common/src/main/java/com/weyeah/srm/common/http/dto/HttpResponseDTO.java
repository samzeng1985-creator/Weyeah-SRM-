package com.weyeah.srm.common.http.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HttpResponseDTO<T> {

    private int statusCode;

    private String body;

    private T data;

    private boolean success;

    private String errorMessage;

    private long responseTime;
}
