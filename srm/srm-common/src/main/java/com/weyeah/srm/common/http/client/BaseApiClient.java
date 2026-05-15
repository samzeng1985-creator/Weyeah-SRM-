package com.weyeah.srm.common.http.client;

import com.weyeah.srm.common.http.dto.HttpResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public abstract class BaseApiClient {

    protected final HttpClient httpClient;

    protected abstract String getBaseUrl();

    protected abstract Map<String, String> getDefaultHeaders();

    protected HttpResponseDTO<String> get(String path) {
        return get(path, null);
    }

    protected HttpResponseDTO<String> get(String path, Map<String, Object> params) {
        String url = buildUrl(path);
        return httpClient.get(url, params, getDefaultHeaders());
    }

    protected HttpResponseDTO<String> post(String path, Object body) {
        String url = buildUrl(path);
        return httpClient.postWithHeaders(url, body, getDefaultHeaders());
    }

    protected <T> HttpResponseDTO<T> post(String path, Object body, Class<T> responseType) {
        String url = buildUrl(path);
        return httpClient.post(url, body, responseType);
    }

    protected String buildUrl(String path) {
        String baseUrl = getBaseUrl();
        if (baseUrl.endsWith("/") && path.startsWith("/")) {
            return baseUrl + path.substring(1);
        } else if (!baseUrl.endsWith("/") && !path.startsWith("/")) {
            return baseUrl + "/" + path;
        }
        return baseUrl + path;
    }

    protected void handleError(HttpResponseDTO<?> response, String operation) {
        if (!response.isSuccess()) {
            log.error("API call failed for operation: {}, error: {}",
                    operation, response.getErrorMessage());
            throw new RuntimeException("API call failed: " + response.getErrorMessage());
        }
    }
}
