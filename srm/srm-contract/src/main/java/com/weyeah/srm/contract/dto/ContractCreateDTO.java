package com.weyeah.srm.contract.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ContractCreateDTO {

    @NotBlank(message = "合同名称不能为空")
    @Size(max = 200, message = "合同名称长度不能超过200")
    private String name;

    @NotBlank(message = "合同类型不能为空")
    private String type;

    @NotNull(message = "供应商ID不能为空")
    private Long supplierId;

    @NotNull(message = "总金额不能为空")
    private BigDecimal totalAmount;

    private String currency;

    @NotNull(message = "生效日期不能为空")
    private LocalDate effectiveDate;

    @NotNull(message = "失效日期不能为空")
    private LocalDate expiryDate;

    @NotBlank(message = "甲方不能为空")
    private String partyA;

    @NotBlank(message = "乙方不能为空")
    private String partyB;

    private String contractFileUrl;

    private String templateCode;

    private String variables;

    private String description;

}
