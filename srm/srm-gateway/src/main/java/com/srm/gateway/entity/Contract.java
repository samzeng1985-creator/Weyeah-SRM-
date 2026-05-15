package com.srm.gateway.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@TableName("contract")
public class Contract {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String code;
    private String name;
    
    @TableField("supplier_id")
    private Long supplierId;
    
    private String type;
    private BigDecimal amount;
    private String currency;
    
    @TableField("start_date")
    private LocalDate startDate;
    
    @TableField("end_date")
    private LocalDate endDate;
    
    private String status;
    private String content;
    
    // NDA合同特有字段
    @TableField("confidentiality_scope")
    private String confidentialityScope;
    
    @TableField("confidentiality_period")
    private Integer confidentialityPeriod;
    
    @TableField("confidentiality_obligations")
    private String confidentialityObligations;
    
    @TableField("liability_for_breach")
    private String liabilityForBreach;
    
    @TableField("dispute_resolution")
    private String disputeResolution;
    
    @TableField("governing_law")
    private String governingLaw;
    
    // 采购合同特有字段
    @TableField("purchase_order_no")
    private String purchaseOrderNo;
    
    @TableField("warehouse")
    private String warehouse;
    
    @TableField("delivery_address")
    private String deliveryAddress;
    
    @TableField("delivery_method")
    private String deliveryMethod;
    
    @TableField("quality_requirements")
    private String qualityRequirements;
    
    @TableField("acceptance_criteria")
    private String acceptanceCriteria;
    
    @TableField("warranty_period")
    private Integer warrantyPeriod;
    
    @TableField("penalty_rate")
    private BigDecimal penaltyRate;
    
    // 委托加工合同特有字段
    @TableField("drawing_no")
    private String drawingNo;
    
    @TableField("drawing_version")
    private String drawingVersion;
    
    @TableField("processing_requirements")
    private String processingRequirements;
    
    @TableField("material_requirements")
    private String materialRequirements;
    
    @TableField("quality_monitoring")
    private String qualityMonitoring;
    
    @TableField("intellectual_property")
    private String intellectualProperty;
    
    // 通用字段
    @TableField("payment_terms")
    private String paymentTerms;
    
    @TableField("attachment_url")
    private String attachmentUrl;
    
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getConfidentialityScope() {
        return confidentialityScope;
    }

    public void setConfidentialityScope(String confidentialityScope) {
        this.confidentialityScope = confidentialityScope;
    }

    public Integer getConfidentialityPeriod() {
        return confidentialityPeriod;
    }

    public void setConfidentialityPeriod(Integer confidentialityPeriod) {
        this.confidentialityPeriod = confidentialityPeriod;
    }

    public String getConfidentialityObligations() {
        return confidentialityObligations;
    }

    public void setConfidentialityObligations(String confidentialityObligations) {
        this.confidentialityObligations = confidentialityObligations;
    }

    public String getLiabilityForBreach() {
        return liabilityForBreach;
    }

    public void setLiabilityForBreach(String liabilityForBreach) {
        this.liabilityForBreach = liabilityForBreach;
    }

    public String getDisputeResolution() {
        return disputeResolution;
    }

    public void setDisputeResolution(String disputeResolution) {
        this.disputeResolution = disputeResolution;
    }

    public String getGoverningLaw() {
        return governingLaw;
    }

    public void setGoverningLaw(String governingLaw) {
        this.governingLaw = governingLaw;
    }

    public String getPurchaseOrderNo() {
        return purchaseOrderNo;
    }

    public void setPurchaseOrderNo(String purchaseOrderNo) {
        this.purchaseOrderNo = purchaseOrderNo;
    }

    public String getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(String warehouse) {
        this.warehouse = warehouse;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getDeliveryMethod() {
        return deliveryMethod;
    }

    public void setDeliveryMethod(String deliveryMethod) {
        this.deliveryMethod = deliveryMethod;
    }

    public String getQualityRequirements() {
        return qualityRequirements;
    }

    public void setQualityRequirements(String qualityRequirements) {
        this.qualityRequirements = qualityRequirements;
    }

    public String getAcceptanceCriteria() {
        return acceptanceCriteria;
    }

    public void setAcceptanceCriteria(String acceptanceCriteria) {
        this.acceptanceCriteria = acceptanceCriteria;
    }

    public Integer getWarrantyPeriod() {
        return warrantyPeriod;
    }

    public void setWarrantyPeriod(Integer warrantyPeriod) {
        this.warrantyPeriod = warrantyPeriod;
    }

    public BigDecimal getPenaltyRate() {
        return penaltyRate;
    }

    public void setPenaltyRate(BigDecimal penaltyRate) {
        this.penaltyRate = penaltyRate;
    }

    public String getDrawingNo() {
        return drawingNo;
    }

    public void setDrawingNo(String drawingNo) {
        this.drawingNo = drawingNo;
    }

    public String getDrawingVersion() {
        return drawingVersion;
    }

    public void setDrawingVersion(String drawingVersion) {
        this.drawingVersion = drawingVersion;
    }

    public String getProcessingRequirements() {
        return processingRequirements;
    }

    public void setProcessingRequirements(String processingRequirements) {
        this.processingRequirements = processingRequirements;
    }

    public String getMaterialRequirements() {
        return materialRequirements;
    }

    public void setMaterialRequirements(String materialRequirements) {
        this.materialRequirements = materialRequirements;
    }

    public String getQualityMonitoring() {
        return qualityMonitoring;
    }

    public void setQualityMonitoring(String qualityMonitoring) {
        this.qualityMonitoring = qualityMonitoring;
    }

    public String getIntellectualProperty() {
        return intellectualProperty;
    }

    public void setIntellectualProperty(String intellectualProperty) {
        this.intellectualProperty = intellectualProperty;
    }

    public String getPaymentTerms() {
        return paymentTerms;
    }

    public void setPaymentTerms(String paymentTerms) {
        this.paymentTerms = paymentTerms;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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
}
