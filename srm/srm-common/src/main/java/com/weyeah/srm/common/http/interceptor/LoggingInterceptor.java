package com.weyeah.srm.common.http.interceptor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Slf4j
public class LoggingInterceptor implements ClientHttpRequestInterceptor {

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body,
            ClientHttpRequestExecution execution) throws IOException {
        long startTime = System.currentTimeMillis();

        logRequest(request, body);

        ClientHttpResponse response = execution.execute(request, body);

        long duration = System.currentTimeMillis() - startTime;
        logResponse(response, duration);

        return response;
    }

    private void logRequest(HttpRequest request, byte[] body) {
        if (log.isDebugEnabled()) {
            String bodyString = body.length > 0 ? new String(body, StandardCharsets.UTF_8) : "";
            log.debug("HTTP Request - Method: {}, URI: {}, Headers: {}, Body: {}",
                    request.getMethod(),
                    request.getURI(),
                    request.getHeaders(),
                    bodyString);
        }
    }

    private void logResponse(ClientHttpResponse response, long duration) throws IOException {
        if (log.isDebugEnabled()) {
            String bodyString = "";
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(response.getBody(), StandardCharsets.UTF_8))) {
                bodyString = reader.lines().collect(Collectors.joining("\n"));
            }

            log.debug("HTTP Response - Status: {}, Duration: {}ms, Body: {}",
                    response.getStatusCode(),
                    duration,
                    bodyString);
        }
    }
}
