package com.weyeah.srm.common.http.client;

import com.weyeah.srm.common.http.dto.HttpResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class WechatWorkApiClient extends BaseApiClient {

    private static final String BASE_URL = "https://qyapi.weixin.qq.com/cgi-bin";

    @Value("${wechat.work.corp-id:}")
    private String corpId;

    @Value("${wechat.work.corp-secret:}")
    private String corpSecret;

    @Value("${wechat.work.agent-id:}")
    private String agentId;

    private String accessToken = "";

    public WechatWorkApiClient(HttpClient httpClient) {
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
        return headers;
    }

    public boolean getAccessToken() {
        Map<String, Object> params = new HashMap<>();
        params.put("corpid", corpId);
        params.put("corpsecret", corpSecret);

        HttpResponseDTO<String> response = get("/gettoken", params);

        if (response.isSuccess() && response.getBody() != null) {
            log.info("WeChat Work token obtained successfully");
            return true;
        }

        log.error("Failed to get WeChat Work token: {}", response.getErrorMessage());
        return false;
    }

    public HttpResponseDTO<String> sendTextMessage(String userId, String content) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("touser", userId);
        requestBody.put("msgtype", "text");
        requestBody.put("agentid", agentId);

        Map<String, String> text = new HashMap<>();
        text.put("content", content);
        requestBody.put("text", text);

        HttpResponseDTO<String> response = post("/message/send?access_token=" + accessToken, requestBody);
        handleError(response, "sendTextMessage");
        return response;
    }

    public HttpResponseDTO<String> sendMarkdownMessage(String userId, String markdown) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("touser", userId);
        requestBody.put("msgtype", "markdown");
        requestBody.put("agentid", agentId);

        Map<String, String> markdownContent = new HashMap<>();
        markdownContent.put("content", markdown);
        requestBody.put("markdown", markdownContent);

        HttpResponseDTO<String> response = post("/message/send?access_token=" + accessToken, requestBody);
        handleError(response, "sendMarkdownMessage");
        return response;
    }

    public HttpResponseDTO<String> sendNewsMessage(String userId, List<Map<String, String>> articles) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("touser", userId);
        requestBody.put("msgtype", "news");
        requestBody.put("agentid", agentId);

        Map<String, Object> news = new HashMap<>();
        news.put("articles", articles);
        requestBody.put("news", news);

        HttpResponseDTO<String> response = post("/message/send?access_token=" + accessToken, requestBody);
        handleError(response, "sendNewsMessage");
        return response;
    }

    public HttpResponseDTO<String> getUserInfo(String code) {
        Map<String, Object> params = new HashMap<>();
        params.put("access_token", accessToken);
        params.put("code", code);

        HttpResponseDTO<String> response = get("/user/getuserinfo", params);
        handleError(response, "getUserInfo");
        return response;
    }

    public HttpResponseDTO<String> getDepartmentList() {
        Map<String, Object> params = new HashMap<>();
        params.put("access_token", accessToken);

        HttpResponseDTO<String> response = get("/department/list", params);
        handleError(response, "getDepartmentList");
        return response;
    }

    public HttpResponseDTO<String> getDepartmentUsers(String departmentId) {
        Map<String, Object> params = new HashMap<>();
        params.put("access_token", accessToken);
        params.put("department_id", departmentId);
        params.put("fetch_child", 1);

        HttpResponseDTO<String> response = get("/user/simplelist", params);
        handleError(response, "getDepartmentUsers");
        return response;
    }
}
