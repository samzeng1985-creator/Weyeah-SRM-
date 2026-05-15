package com.weyeah.srm.pricing.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PricingStrategyUpdateDTO {

    private Long id;

    private String name;

    private String status;

    private BigDecimal unitPrice;

    private BigDecimal minQuantity;

    private BigDecimal maxQuantity;

    private BigDecimal discountRate;

    private LocalDate effectiveDate;

    private LocalDate expiryDate;

    private String currency;

    private String description;
}
