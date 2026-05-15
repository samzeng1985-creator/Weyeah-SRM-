package com.srm.gateway.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@TableName("pricing")
public class Pricing {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String code;
    
    @TableField("material_id")
    private Long materialId;
    
    @TableField("supplier_id")
    private Long supplierId;
    
    private BigDecimal price;
    
    private BigDecimal taxRate;
    
    @TableField("price_with_tax")
    private BigDecimal priceWithTax;
    
    @TableField("min_order_qty")
    private BigDecimal minOrderQty;
    
    private String currency;
    private String unit;
    
    @TableField("effective_date")
    private LocalDate effectiveDate;
    
    @TableField("expiry_date")
    private LocalDate expiryDate;
    
    @TableField("price_terms")
    private String priceTerms;
    
    @TableField("payment_terms")
    private String paymentTerms;
    
    @TableField("delivery_cycle")
    private Integer deliveryCycle;
    
    private String status;
    private String remark;
    
    @TableField("price_change_reason")
    private String priceChangeReason;
    
    @TableField("price_change_detail")
    private String priceChangeDetail;
    
    @TableField("original_price")
    private BigDecimal originalPrice;
    
    @TableField("price_increase_rate")
    private BigDecimal priceIncreaseRate;
    
    @TableField("created_at")
    private LocalDateTime createdAt;
    
    @TableField("updated_at")
    private LocalDateTime updatedAt;
    
    @TableField("created_by")
    private Long createdBy;
    
    @TableField("updated_by")
    private Long updatedBy;
    
    @TableField("del_flag")
    private Integer delFlag;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Long materialId) {
        this.materialId = materialId;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Integer getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(Integer delFlag) {
        this.delFlag = delFlag;
    }

    public BigDecimal getTaxRate() {
        return taxRate;
    }

    public void setTaxRate(BigDecimal taxRate) {
        this.taxRate = taxRate;
    }

    public BigDecimal getPriceWithTax() {
        return priceWithTax;
    }

    public void setPriceWithTax(BigDecimal priceWithTax) {
        this.priceWithTax = priceWithTax;
    }

    public BigDecimal getMinOrderQty() {
        return minOrderQty;
    }

    public void setMinOrderQty(BigDecimal minOrderQty) {
        this.minOrderQty = minOrderQty;
    }

    public String getPriceTerms() {
        return priceTerms;
    }

    public void setPriceTerms(String priceTerms) {
        this.priceTerms = priceTerms;
    }

    public String getPaymentTerms() {
        return paymentTerms;
    }

    public void setPaymentTerms(String paymentTerms) {
        this.paymentTerms = paymentTerms;
    }

    public Integer getDeliveryCycle() {
        return deliveryCycle;
    }

    public void setDeliveryCycle(Integer deliveryCycle) {
        this.deliveryCycle = deliveryCycle;
    }

    public String getPriceChangeReason() {
        return priceChangeReason;
    }

    public void setPriceChangeReason(String priceChangeReason) {
        this.priceChangeReason = priceChangeReason;
    }

    public String getPriceChangeDetail() {
        return priceChangeDetail;
    }

    public void setPriceChangeDetail(String priceChangeDetail) {
        this.priceChangeDetail = priceChangeDetail;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public BigDecimal getPriceIncreaseRate() {
        return priceIncreaseRate;
    }

    public void setPriceIncreaseRate(BigDecimal priceIncreaseRate) {
        this.priceIncreaseRate = priceIncreaseRate;
    }
}
