package com.weyeah.srm.purchase.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PurchaseOrderUpdateDTO {

    private Long id;

    private String title;

    private String status;

    private Long materialId;

    private BigDecimal quantity;

    private BigDecimal unitPrice;

    private String currency;

    private LocalDate requiredDate;

    private LocalDate deliveryDate;

    private String deliveryAddress;

    private String contactPerson;

    private String contactPhone;

    private String remark;
}
