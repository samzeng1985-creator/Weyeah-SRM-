package com.weyeah.srm.common.http.client;

import com.weyeah.srm.common.http.dto.HttpResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class FeishuApiClient extends BaseApiClient {

    private static final String BASE_URL = "https://open.feishu.cn/open-apis";

    @Value("${feishu.app-id:}")
    private String appId;

    @Value("${feishu.app-secret:}")
    private String appSecret;

    private String accessToken = "";

    public FeishuApiClient(HttpClient httpClient) {
        super(httpClient);
    }

    @Override
    protected String getBaseUrl() {
        return BASE_URL;
    }

    @Override
    protected Map<String, String> getDefaultHeaders() {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        if (!accessToken.isEmpty()) {
            headers.put("Authorization", "Bearer " + accessToken);
        }
        return headers;
    }

    public boolean authenticate() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("app_id", appId);
        requestBody.put("app_secret", appSecret);

        HttpResponseDTO<String> response = post("/auth/v3/tenant_access_token/internal", requestBody);

        if (response.isSuccess() && response.getBody() != null) {
            log.info("Feishu authentication successful");
            return true;
        }

        log.error("Feishu authentication failed: {}", response.getErrorMessage());
        return false;
    }

    public HttpResponseDTO<String> createApprovalInstance(Map<String, Object> approvalData) {
        HttpResponseDTO<String> response = post("/approval/v4/instances", approvalData);
        handleError(response, "createApprovalInstance");
        return response;
    }

    public HttpResponseDTO<String> getApprovalInstance(String instanceCode) {
        String path = "/approval/v4/instances/" + instanceCode;
        HttpResponseDTO<String> response = get(path);
        handleError(response, "getApprovalInstance");
        return response;
    }

    public HttpResponseDTO<String> sendMessage(String userId, String message) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("user_id", userId);
        requestBody.put("msg_type", "text");

        Map<String, String> textContent = new HashMap<>();
        textContent.put("text", message);
        requestBody.put("content", textContent);

        HttpResponseDTO<String> response = post("/message/v4/send", requestBody);
        handleError(response, "sendMessage");
        return response;
    }

    public HttpResponseDTO<String> uploadFile(String fileType, byte[] fileContent) {
        HttpResponseDTO<String> response = post("/im/v1/files", fileContent);
        handleError(response, "uploadFile");
        return response;
    }
}
