package com.weyeah.srm.common.http.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.weyeah.srm.common.http.config.HttpClientConfig;
import com.weyeah.srm.common.http.dto.HttpRequestDTO;
import com.weyeah.srm.common.http.dto.HttpResponseDTO;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Slf4j
@Component
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class HttpClient {

    private final RestTemplate restTemplate;
    private final HttpClientConfig config;
    private final ObjectMapper objectMapper;

    public HttpClient(HttpClientConfig config, List<ClientHttpRequestInterceptor> interceptors) {
        this.config = config;
        this.objectMapper = new ObjectMapper();
        this.restTemplate = createRestTemplate(interceptors);
    }

    private RestTemplate createRestTemplate(List<ClientHttpRequestInterceptor> interceptors) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout((int) config.getConnectTimeoutDuration().toMillis());
        factory.setReadTimeout((int) config.getReadTimeoutDuration().toMillis());

        RestTemplate template = new RestTemplate(factory);

        if (!CollectionUtils.isEmpty(interceptors)) {
            template.setInterceptors(interceptors);
        }

        return template;
    }

    public HttpResponseDTO<String> execute(HttpRequestDTO requestDTO) {
        long startTime = System.currentTimeMillis();

        try {
            HttpHeaders headers = buildHeaders(requestDTO.getHeaders());
            HttpEntity<Object> entity = new HttpEntity<>(requestDTO.getBody(), headers);

            String url = buildUrl(requestDTO.getUrl(), requestDTO.getParams());
            HttpMethod method = HttpMethod.valueOf(requestDTO.getMethod().toUpperCase(Locale.ROOT));

            ResponseEntity<String> response = restTemplate.exchange(
                    url, method, entity, String.class);

            long responseTime = System.currentTimeMillis() - startTime;

            return HttpResponseDTO.<String>builder()
                    .statusCode(response.getStatusCode().value())
                    .body(response.getBody())
                    .success(response.getStatusCode().is2xxSuccessful())
                    .responseTime(responseTime)
                    .build();

        } catch (RestClientException e) {
            long responseTime = System.currentTimeMillis() - startTime;
            log.error("HTTP request failed: {}", e.getMessage(), e);

            return HttpResponseDTO.<String>builder()
                    .success(false)
                    .errorMessage(e.getMessage())
                    .responseTime(responseTime)
                    .build();
        }
    }

    public <T> HttpResponseDTO<T> execute(HttpRequestDTO requestDTO, Class<T> responseType) {
        HttpResponseDTO<String> response = execute(requestDTO);

        if (!response.isSuccess() || !StringUtils.hasText(response.getBody())) {
            return HttpResponseDTO.<T>builder()
                    .statusCode(response.getStatusCode())
                    .success(response.isSuccess())
                    .errorMessage(response.getErrorMessage())
                    .responseTime(response.getResponseTime())
                    .build();
        }

        try {
            T data = objectMapper.readValue(response.getBody(), responseType);
            return HttpResponseDTO.<T>builder()
                    .statusCode(response.getStatusCode())
                    .body(response.getBody())
                    .data(data)
                    .success(true)
                    .responseTime(response.getResponseTime())
                    .build();
        } catch (JsonProcessingException e) {
            log.error("Failed to parse response: {}", e.getMessage(), e);
            return HttpResponseDTO.<T>builder()
                    .statusCode(response.getStatusCode())
                    .body(response.getBody())
                    .success(false)
                    .errorMessage("Failed to parse response: " + e.getMessage())
                    .responseTime(response.getResponseTime())
                    .build();
        }
    }

    public HttpResponseDTO<String> get(String url) {
        return get(url, null, null);
    }

    public HttpResponseDTO<String> get(String url, Map<String, Object> params) {
        return get(url, params, null);
    }

    public HttpResponseDTO<String> get(String url, Map<String, Object> params,
            Map<String, String> headers) {
        HttpRequestDTO requestDTO = HttpRequestDTO.builder()
                .url(url)
                .method("GET")
                .params(params)
                .headers(headers)
                .build();
        return execute(requestDTO);
    }

    public HttpResponseDTO<String> post(String url, Object body) {
        HttpRequestDTO requestDTO = HttpRequestDTO.builder()
                .url(url)
                .method("POST")
                .body(body)
                .build();
        return execute(requestDTO);
    }

    public HttpResponseDTO<String> postWithHeaders(String url, Object body, Map<String, String> headers) {
        HttpRequestDTO requestDTO = HttpRequestDTO.builder()
                .url(url)
                .method("POST")
                .body(body)
                .headers(headers)
                .build();
        return execute(requestDTO);
    }

    public <T> HttpResponseDTO<T> post(String url, Object body, Class<T> responseType) {
        HttpRequestDTO requestDTO = HttpRequestDTO.builder()
                .url(url)
                .method("POST")
                .body(body)
                .build();
        return execute(requestDTO, responseType);
    }

    private HttpHeaders buildHeaders(Map<String, String> headers) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        if (!CollectionUtils.isEmpty(headers)) {
            headers.forEach(httpHeaders::set);
        }

        return httpHeaders;
    }

    private String buildUrl(String url, Map<String, Object> params) {
        if (CollectionUtils.isEmpty(params)) {
            return url;
        }

        StringBuilder sb = new StringBuilder(url);
        sb.append("?");

        List<String> paramList = new ArrayList<>();
        params.forEach((key, value) -> {
            if (value != null) {
                paramList.add(key + "=" + value);
            }
        });

        sb.append(String.join("&", paramList));
        return sb.toString();
    }
}
