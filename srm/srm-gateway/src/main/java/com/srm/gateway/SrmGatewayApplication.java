package com.srm.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.srm")
@SuppressWarnings("checkstyle:HideUtilityClassConstructor")
public class SrmGatewayApplication {


    public SrmGatewayApplication() {
    }


    public static void main(String[] args) {
        SpringApplication.run(SrmGatewayApplication.class, args);
    }

}