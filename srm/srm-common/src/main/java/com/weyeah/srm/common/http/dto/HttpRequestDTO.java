package com.weyeah.srm.common.http.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
public class HttpRequestDTO {

    private String url;

    private String method;

    private Map<String, String> headers;

    private Map<String, Object> params;

    private Object body;

    private int retryCount;

    private boolean logEnabled;

    public Map<String, String> getHeaders() {
        return headers != null ? Collections.unmodifiableMap(headers) : null;
    }

    public Map<String, Object> getParams() {
        return params != null ? Collections.unmodifiableMap(params) : null;
    }

    public void setHeaders(Map<String, String> headers) {
        this.headers = headers != null ? new HashMap<>(headers) : null;
    }

    public void setParams(Map<String, Object> params) {
        this.params = params != null ? new HashMap<>(params) : null;
    }

    public static class HttpRequestDTOBuilder {
        public HttpRequestDTOBuilder headers(Map<String, String> headers) {
            this.headers = headers != null ? new HashMap<>(headers) : null;
            return this;
        }

        public HttpRequestDTOBuilder params(Map<String, Object> params) {
            this.params = params != null ? new HashMap<>(params) : null;
            return this;
        }
    }
}
