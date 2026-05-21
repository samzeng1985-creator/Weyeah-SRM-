package com.srm.gateway.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@TableName("contract_item")
public class ContractItem {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("contract_id")
    private Long contractId;
    
    @TableField("material_id")
    private Long materialId;
    
    @TableField("material_code")
    private String materialCode;
    
    @TableField("material_name")
    private String materialName;
    
    @TableField("material_spec")
    private String materialSpec;
    
    @TableField("material_model")
    private String materialModel;
    
    // 物料快照字段（创建合同时复制）
    @TableField("snapshot_data")
    private String snapshotData;
    
    @TableField("snapshot_name")
    private String snapshotName;
    
    @TableField("snapshot_model")
    private String snapshotModel;
    
    @TableField("snapshot_drawing_version")
    private String snapshotDrawingVersion;
    
    @TableField("snapshot_time")
    private LocalDateTime snapshotTime;
    
    private BigDecimal quantity;
    
    private String unit;
    
    @TableField("unit_price")
    private BigDecimal unitPrice;
    
    @TableField("tax_rate")
    private BigDecimal taxRate;
    
    @TableField("price_with_tax")
    private BigDecimal priceWithTax;
    
    @TableField("total_price")
    private BigDecimal totalPrice;
    
    @TableField("total_price_with_tax")
    private BigDecimal totalPriceWithTax;
    
    @TableField("delivery_date")
    private LocalDate deliveryDate;
    
    @TableField("sort_order")
    private Integer sortOrder;
    
    private String remark;
    
    @TableField("created_at")
    private LocalDateTime createdAt;
    
    @TableField("updated_at")
    private LocalDateTime updatedAt;
    
    @TableField("del_flag")
    @TableLogic
    private Integer delFlag;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public Long getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Long materialId) {
        this.materialId = materialId;
    }

    public String getMaterialCode() {
        return materialCode;
    }

    public void setMaterialCode(String materialCode) {
        this.materialCode = materialCode;
    }

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public String getMaterialSpec() {
        return materialSpec;
    }

    public void setMaterialSpec(String materialSpec) {
        this.materialSpec = materialSpec;
    }

    public String getMaterialModel() {
        return materialModel;
    }

    public void setMaterialModel(String materialModel) {
        this.materialModel = materialModel;
    }

    public String getSnapshotData() {
        return snapshotData;
    }

    public void setSnapshotData(String snapshotData) {
        this.snapshotData = snapshotData;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
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

    public Integer getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(Integer delFlag) {
        this.delFlag = delFlag;
    }

    public String getSnapshotName() {
        return snapshotName;
    }

    public void setSnapshotName(String snapshotName) {
        this.snapshotName = snapshotName;
    }

    public String getSnapshotModel() {
        return snapshotModel;
    }

    public void setSnapshotModel(String snapshotModel) {
        this.snapshotModel = snapshotModel;
    }

    public String getSnapshotDrawingVersion() {
        return snapshotDrawingVersion;
    }

    public void setSnapshotDrawingVersion(String snapshotDrawingVersion) {
        this.snapshotDrawingVersion = snapshotDrawingVersion;
    }

    public LocalDateTime getSnapshotTime() {
        return snapshotTime;
    }

    public void setSnapshotTime(LocalDateTime snapshotTime) {
        this.snapshotTime = snapshotTime;
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

    public BigDecimal getTotalPriceWithTax() {
        return totalPriceWithTax;
    }

    public void setTotalPriceWithTax(BigDecimal totalPriceWithTax) {
        this.totalPriceWithTax = totalPriceWithTax;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }
}
