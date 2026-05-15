package com.weyeah.srm.common.http.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Data
@Component
@ConfigurationProperties(prefix = "srm.http")
public class HttpClientConfig {

    private int connectTimeout = 10000;

    private int readTimeout = 30000;

    private int maxConnections = 200;

    private int maxConnectionsPerRoute = 50;

    private int retryCount = 3;

    private int retryInterval = 1000;

    private boolean logEnabled = true;

    public Duration getConnectTimeoutDuration() {
        return Duration.ofMillis(connectTimeout);
    }

    public Duration getReadTimeoutDuration() {
        return Duration.ofMillis(readTimeout);
    }
}
