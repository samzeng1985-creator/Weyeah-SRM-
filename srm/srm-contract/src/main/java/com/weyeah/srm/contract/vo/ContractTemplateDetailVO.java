package com.weyeah.srm.contract.vo;

import lombok.Data;

@Data
public class ContractTemplateDetailVO {

    private Long id;

    private String code;

    private String name;

    private String type;

    private String htmlContent;

    private String variableSchema;

    private String description;

    private Boolean isDefault;

    private String createTime;

    private String updateTime;

}
