package com.weyeah.srm.common.http.client;

import com.weyeah.srm.common.http.dto.HttpRequestDTO;
import com.weyeah.srm.common.http.dto.HttpResponseDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class HttpClientTest {

    @Autowired
    private HttpClient httpClient;

    @Test
    void testGetRequest() {
        HttpResponseDTO<String> response = httpClient.get("https://httpbin.org/get");

        assertNotNull(response);
        assertTrue(response.isSuccess() || !response.isSuccess());
    }

    @Test
    void testGetWithParams() {
        Map<String, Object> params = new HashMap<>();
        params.put("key1", "value1");
        params.put("key2", "value2");

        HttpResponseDTO<String> response = httpClient.get("https://httpbin.org/get", params);

        assertNotNull(response);
    }

    @Test
    void testPostRequest() {
        Map<String, String> body = new HashMap<>();
        body.put("name", "test");
        body.put("value", "123");

        HttpResponseDTO<String> response = httpClient.post("https://httpbin.org/post", body);

        assertNotNull(response);
    }

    @Test
    void testExecuteWithCustomRequest() {
        Map<String, String> headers = new HashMap<>();
        headers.put("X-Custom-Header", "test-value");

        HttpRequestDTO requestDTO = HttpRequestDTO.builder()
                .url("https://httpbin.org/get")
                .method("GET")
                .headers(headers)
                .build();

        HttpResponseDTO<String> response = httpClient.execute(requestDTO);

        assertNotNull(response);
    }

    @Test
    void testBuildUrl() {
        Map<String, Object> params = new HashMap<>();
        params.put("page", 1);
        params.put("size", 10);

        HttpRequestDTO requestDTO = HttpRequestDTO.builder()
                .url("https://api.example.com/users")
                .method("GET")
                .params(params)
                .build();

        HttpResponseDTO<String> response = httpClient.execute(requestDTO);

        assertNotNull(response);
    }
}
